"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/assets";
import { SOUNDTRACK } from "@/app/data";

/**
 * La musique de fond.
 *
 * Les navigateurs refusent de lancer un son tant que la personne n'a rien
 * cliqué. L'ouverture de l'enveloppe est justement ce clic : c'est elle qui
 * démarre la musique, au moment exact où la page apparaît.
 *
 * Pour un visiteur qui revient, il n'y a pas d'enveloppe et donc pas de geste.
 * On tente quand même, et si le navigateur refuse, le bouton reste sur pause en
 * attendant un clic.
 */

/** Émis par l'enveloppe quand elle finit de s'ouvrir. */
export const OUVERTURE_EVENT = "anna:enveloppe-ouverte";

/**
 * Émis dès qu'un souvenir prend le son, pour que la musique s'efface derrière
 * lui au lieu de se superposer.
 */
export const DUCK_EVENT = "anna:duck";

export function ducker(actif: boolean) {
  window.dispatchEvent(new CustomEvent(DUCK_EVENT, { detail: { actif } }));
}

const STORAGE_KEY = "anna:musique";

/**
 * Volume de croisière, et volume quand un souvenir parle par-dessus.
 * Volontairement bas : la musique doit se sentir, pas s'entendre.
 */
const VOLUME = 0.14;
const VOLUME_DUCK = 0.03;
const FONDU = 2200;

function NoteIcon({ actif }: { actif: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
      {!actif && <path d="M3 3l18 18" />}
    </svg>
  );
}

export default function Soundtrack() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [joue, setJoue] = useState(false);
  const [dispo, setDispo] = useState(true);

  const ducks = useRef(0);
  const fonduRef = useRef<number | null>(null);

  /** Amène le volume à `cible` progressivement, sans à-coup. */
  const glisserVolume = useCallback((cible: number, duree: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fonduRef.current !== null) window.clearInterval(fonduRef.current);

    const depart = audio.volume;
    const debut = performance.now();

    fonduRef.current = window.setInterval(() => {
      const t = Math.min((performance.now() - debut) / duree, 1);
      audio.volume = depart + (cible - depart) * t;
      if (t === 1 && fonduRef.current !== null) {
        window.clearInterval(fonduRef.current);
        fonduRef.current = null;
      }
    }, 40);
  }, []);

  const volumeVoulu = useCallback(
    () => (ducks.current > 0 ? VOLUME_DUCK : VOLUME),
    [],
  );

  const lancer = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    try {
      await audio.play();
      setJoue(true);
      glisserVolume(volumeVoulu(), FONDU);
      try {
        localStorage.setItem(STORAGE_KEY, "on");
      } catch {
        // Stockage refusé : la musique repartira au prochain clic, tant pis.
      }
    } catch {
      // Refusé par le navigateur : le bouton attendra un vrai clic.
      setJoue(false);
    }
  }, [glisserVolume, volumeVoulu]);

  const basculer = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (joue) {
      audio.pause();
      setJoue(false);
      try {
        localStorage.setItem(STORAGE_KEY, "off");
      } catch {
        // Sans stockage, le choix ne survit pas au rechargement. Pas grave.
      }
    } else {
      void lancer();
    }
  }, [joue, lancer]);

  // Démarrage : à l'ouverture de l'enveloppe, ou tout de suite si le visiteur
  // revient et n'avait pas coupé la musique.
  useEffect(() => {
    if (!SOUNDTRACK) return;

    const onOuverture = () => void lancer();
    window.addEventListener(OUVERTURE_EVENT, onOuverture);

    let coupee = false;
    try {
      coupee = localStorage.getItem(STORAGE_KEY) === "off";
    } catch {
      // Pas de stockage lisible : on tente, le navigateur tranchera.
    }
    // Visiteur qui revient : on tente une reprise, mais hors du corps de
    // l'effet — sinon on déclenche un rendu en cascade dès le montage.
    const dejaVue = document.documentElement.dataset.enveloppe === "vue";
    const reprise =
      dejaVue && !coupee ? window.setTimeout(() => void lancer(), 0) : null;

    return () => {
      window.removeEventListener(OUVERTURE_EVENT, onOuverture);
      if (reprise !== null) window.clearTimeout(reprise);
    };
  }, [lancer]);

  // Un souvenir prend le son : la musique s'efface, puis revient.
  useEffect(() => {
    const onDuck = (event: Event) => {
      const { actif } = (event as CustomEvent<{ actif: boolean }>).detail;
      ducks.current = Math.max(0, ducks.current + (actif ? 1 : -1));
      glisserVolume(volumeVoulu(), 400);
    };
    window.addEventListener(DUCK_EVENT, onDuck);
    return () => window.removeEventListener(DUCK_EVENT, onDuck);
  }, [glisserVolume, volumeVoulu]);

  useEffect(() => {
    return () => {
      if (fonduRef.current !== null) window.clearInterval(fonduRef.current);
    };
  }, []);

  // Pas de bande-son configurée, ou fichier absent : pas de bouton du tout.
  if (!SOUNDTRACK || !dispo) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={asset(SOUNDTRACK)}
        loop
        preload="auto"
        onError={() => setDispo(false)}
      />

      <button
        type="button"
        onClick={basculer}
        aria-pressed={joue}
        aria-label={joue ? "Couper la musique" : "Remettre la musique"}
        className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-lilas-300 bg-white/80 text-lilas-700 shadow-lg shadow-lilas-700/20 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white sm:bottom-7 sm:right-7"
      >
        <NoteIcon actif={joue} />
      </button>
    </>
  );
}
