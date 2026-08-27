"use client";

import { useEffect, useRef } from "react";

/** Événement déclenché par les boutons pour faire éclater une gerbe de pétales. */
export const PETAL_BURST_EVENT = "anna:petal-burst";

export function burstPetals(x: number, y: number, count = 80) {
  window.dispatchEvent(
    new CustomEvent(PETAL_BURST_EVENT, { detail: { x, y, count } }),
  );
}

/** Du lilas pâle au violet profond, avec deux touches de rose poudré. */
const COULEURS = [
  "#eadcf6",
  "#dcc9ee",
  "#c9a8e9",
  "#b58fdf",
  "#8b5fbf",
  "#f0cdd7",
  "#e4a9b8",
];

type Petale = {
  x: number;
  y: number;
  /** Position horizontale de référence : le pétale oscille autour d'elle. */
  baseX: number;
  vx: number;
  vy: number;
  taille: number;
  angle: number;
  /** Vitesse de rotation dans le plan de l'écran. */
  rotation: number;
  /** Bascule du pétale sur lui-même, ce qui l'aplatit puis le rouvre. */
  bascule: number;
  vitesseBascule: number;
  amplitude: number;
  vitesseOscillation: number;
  phase: number;
  couleur: string;
  opacite: number;
  /** Un pétale d'explosion part en gerbe et s'efface ; les autres tombent. */
  burst: boolean;
};

function petaleAmbiant(w: number, h: number, auDessus: boolean): Petale {
  const taille = 6 + Math.random() * 12;
  const baseX = Math.random() * w;
  return {
    x: baseX,
    y: auDessus ? -Math.random() * h * 0.6 - 20 : Math.random() * h,
    baseX,
    vx: 0,
    // Les gros pétales tombent un peu plus vite que les petits.
    vy: 20 + Math.random() * 44 + taille * 1.3,
    taille,
    angle: Math.random() * Math.PI * 2,
    rotation: (Math.random() - 0.5) * 1,
    bascule: Math.random() * Math.PI * 2,
    vitesseBascule: 0.5 + Math.random() * 1.3,
    amplitude: 12 + Math.random() * 44,
    vitesseOscillation: 0.3 + Math.random() * 0.55,
    phase: Math.random() * Math.PI * 2,
    couleur: COULEURS[(Math.random() * COULEURS.length) | 0],
    opacite: 0.4 + Math.random() * 0.5,
    burst: false,
  };
}

function petaleExplosion(x: number, y: number): Petale {
  const taille = 5 + Math.random() * 11;
  const angle = Math.random() * Math.PI * 2;
  const vitesse = 90 + Math.random() * 300;
  return {
    x,
    y,
    baseX: x,
    vx: Math.cos(angle) * vitesse,
    vy: Math.sin(angle) * vitesse - 140,
    taille,
    angle: Math.random() * Math.PI * 2,
    rotation: (Math.random() - 0.5) * 4,
    bascule: Math.random() * Math.PI * 2,
    vitesseBascule: 1.4 + Math.random() * 2.4,
    amplitude: 0,
    vitesseOscillation: 0,
    phase: 0,
    couleur: COULEURS[(Math.random() * COULEURS.length) | 0],
    opacite: 0.75 + Math.random() * 0.25,
    burst: true,
  };
}

function dessinerPetale(ctx: CanvasRenderingContext2D, p: Petale) {
  const s = p.taille;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  // La bascule simule le pétale qui tourne sur lui-même en tombant : vu de
  // profil il s'aplatit, puis se rouvre.
  ctx.scale(1, Math.max(0.18, Math.abs(Math.cos(p.bascule))));
  ctx.globalAlpha = Math.max(0, p.opacite);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(s * 0.55, -s * 0.62, s * 1.35, -s * 0.3, s * 1.5, s * 0.16);
  ctx.bezierCurveTo(s * 1.32, s * 0.78, s * 0.5, s * 0.72, 0, 0);
  ctx.closePath();
  ctx.fillStyle = p.couleur;
  ctx.fill();
  ctx.restore();
}

/** Pluie continue de pétales violets, derrière toute la page. */
export default function PetalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let petales: Petale[] = [];
    let raf = 0;
    let last = 0;
    let elapsed = 0;

    const nombreAmbiant = () => {
      const w = window.innerWidth;
      if (w < 640) return 26;
      if (w < 1024) return 40;
      return 56;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const semer = () => {
      petales = Array.from({ length: nombreAmbiant() }, () =>
        petaleAmbiant(width, height, false),
      );
    };

    resize();
    semer();

    if (reduced) {
      // Pas d'animation : un décor de pétales figé, discret.
      const dessinerFige = () => {
        ctx.clearRect(0, 0, width, height);
        for (const p of petales) {
          p.opacite *= 0.6;
          dessinerPetale(ctx, p);
        }
      };
      dessinerFige();
      const onResizeStatic = () => {
        resize();
        semer();
        dessinerFige();
      };
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    const onResize = () => {
      resize();
      const cible = nombreAmbiant();
      const ambiants = petales.filter((p) => !p.burst);
      while (ambiants.length < cible) {
        ambiants.push(petaleAmbiant(width, height, true));
      }
      petales = [...ambiants.slice(0, cible), ...petales.filter((p) => p.burst)];
    };

    const onBurst = (event: Event) => {
      const { x, y, count } = (
        event as CustomEvent<{ x: number; y: number; count: number }>
      ).detail;
      const place = Math.max(0, 420 - petales.length);
      const n = Math.min(count, place);
      for (let i = 0; i < n; i++) petales.push(petaleExplosion(x, y));
    };

    const frame = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      elapsed += dt;

      ctx.clearRect(0, 0, width, height);

      for (let i = petales.length - 1; i >= 0; i--) {
        const p = petales[i];
        p.angle += p.rotation * dt;
        p.bascule += p.vitesseBascule * dt;

        if (p.burst) {
          p.vy += 620 * dt; // gravité
          p.vx *= 1 - 1.1 * dt; // frottement de l'air
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.opacite -= 0.28 * dt;
          if (p.opacite <= 0.02 || p.y > height + 60) {
            petales.splice(i, 1);
            continue;
          }
        } else {
          p.y += p.vy * dt;
          p.x = p.baseX + Math.sin(elapsed * p.vitesseOscillation + p.phase) * p.amplitude;
          // Sorti par le bas : on le renvoie en haut, la pluie ne s'arrête pas.
          if (p.y > height + 40) {
            const frais = petaleAmbiant(width, height, false);
            frais.y = -30;
            petales[i] = frais;
          }
        }

        dessinerPetale(ctx, petales[i]);
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    window.addEventListener(PETAL_BURST_EVENT, onBurst);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener(PETAL_BURST_EVENT, onBurst);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}
