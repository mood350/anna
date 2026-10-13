/**
 * La musique de fond.
 *
 * Les navigateurs refusent tout son tant qu'on n'a rien touché : c'est
 * l'ouverture de la couverture qui la lance. Le volume passe par Web Audio
 * quand c'est possible, parce que sur iPhone `audio.volume` est ignoré et la
 * musique partirait à fond.
 *
 * Quand un souvenir prend le son (vidéo avec le son, ou vue plein écran), la
 * musique descend puis remonte, au lieu de se superposer.
 */

const STORAGE_KEY = "anna:musique";
/** Volume de croisière : la musique doit se sentir, pas couvrir la lecture. */
const VOLUME = 0.16;
const VOLUME_DUCK = 0.025;

type Listener = (playing: boolean) => void;

class Music {
  private src: string | null = null;
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private ducks = 0;
  private raf = 0;
  private listeners = new Set<Listener>();
  playing = false;
  available = true;

  setSource(src: string | null) {
    this.src = src;
    this.available = !!src;
  }

  /** La personne a-t-elle coupé la musique lors d'une visite précédente ? */
  private get muted(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === "off";
    } catch {
      return false;
    }
  }

  private remember(on: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      /* stockage refusé : tant pis, on ne retient rien */
    }
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.playing));
  }

  private ensure() {
    if (this.audio || !this.src) return;
    const audio = new Audio(this.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.addEventListener("error", () => {
      this.available = false;
      this.playing = false;
      this.emit();
    });
    this.audio = audio;

    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      try {
        this.ctx = new Ctx();
        const source = this.ctx.createMediaElementSource(audio);
        this.gain = this.ctx.createGain();
        this.gain.gain.value = 0;
        source.connect(this.gain).connect(this.ctx.destination);
      } catch {
        this.ctx = null;
        this.gain = null;
      }
    }
    if (!this.gain) audio.volume = 0;
  }

  private get level() {
    return this.gain ? this.gain.gain.value : (this.audio?.volume ?? 0);
  }

  private set level(v: number) {
    if (this.gain) this.gain.gain.value = v;
    else if (this.audio) this.audio.volume = v;
  }

  private fadeTo(target: number, ms: number, then?: () => void) {
    cancelAnimationFrame(this.raf);
    const from = this.level;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - t0) / ms, 1);
      const eased = t * t * (3 - 2 * t);
      this.level = from + (target - from) * eased;
      if (t < 1) this.raf = requestAnimationFrame(step);
      else then?.();
    };
    this.raf = requestAnimationFrame(step);
  }

  private target() {
    return this.ducks > 0 ? VOLUME_DUCK : VOLUME;
  }

  /** À appeler pendant un geste (clic, toucher, touche du clavier). */
  start() {
    if (!this.available || this.playing || this.muted) return;
    this.play();
  }

  private play() {
    this.ensure();
    if (!this.audio) return;
    void this.ctx?.resume();
    this.audio
      .play()
      .then(() => {
        this.playing = true;
        this.emit();
        this.fadeTo(this.target(), 2200);
      })
      .catch(() => {
        this.playing = false;
        this.emit();
      });
  }

  toggle() {
    if (this.playing) {
      this.remember(false);
      this.playing = false;
      this.emit();
      this.fadeTo(0, 500, () => this.audio?.pause());
    } else {
      this.remember(true);
      this.play();
    }
  }

  duck(on: boolean) {
    this.ducks = Math.max(0, this.ducks + (on ? 1 : -1));
    if (this.playing) this.fadeTo(this.target(), on ? 600 : 1800);
  }
}

export const music = new Music();
