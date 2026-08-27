"use client";

import { useRef } from "react";
import { gsap, useGSAP, mouvementOk } from "@/lib/gsap";

/**
 * Un soleil qui traverse toute la page — et qui ne se laisse pas approcher.
 *
 * Dès que le curseur entre dans son rayon, il file vers celui des quatre coins
 * de l'écran qui est le plus loin : impossible de le coincer, puisque le coin
 * choisi dépend d'où on vient. Laissé tranquille deux secondes, il remonte se
 * poser en haut à droite, là où on met un soleil.
 *
 * Il vit derrière le contenu (`z-0`, la page est en `z-10`) : il éclaire le
 * fond violet et passe derrière la lettre au lieu de la recouvrir. On peut donc
 * jouer avec sans jamais gêner la lecture.
 */

/** Position de repos, en fractions de l'écran. */
const MAISON = { x: 0.82, y: 0.16 };

/** Les quatre coins, avec une marge pour que le soleil reste entier. */
const COINS = [
  { x: 0.12, y: 0.14 },
  { x: 0.88, y: 0.14 },
  { x: 0.12, y: 0.86 },
  { x: 0.88, y: 0.86 },
];

/** Rayon de fuite, en pixels. */
const RAYON = 170;

/** Temps de calme avant qu'il retourne à sa place, en secondes. */
const REPOS = 2;

export default function SunChase() {
  const cadre = useRef<HTMLDivElement>(null);
  const soleil = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const astre = soleil.current;
      if (!astre) return;

      let largeur = window.innerWidth;
      let hauteur = window.innerHeight;
      /** Où le soleil est posé, en fractions de l'écran. */
      let place = { ...MAISON };
      let retour: gsap.core.Tween | null = null;

      const poser = (cible: { x: number; y: number }, duree: number, ease: string) => {
        place = cible;
        gsap.to(astre, {
          x: cible.x * largeur,
          y: cible.y * hauteur,
          duration: duree,
          ease,
          overwrite: "auto",
        });
      };

      const mesurer = () => {
        largeur = window.innerWidth;
        hauteur = window.innerHeight;
        gsap.set(astre, { x: place.x * largeur, y: place.y * hauteur });
      };

      mesurer();

      // Sans mouvement, le soleil reste simplement à sa place.
      if (!mouvementOk()) {
        window.addEventListener("resize", mesurer);
        return () => window.removeEventListener("resize", mesurer);
      }

      const rentrer = () => {
        retour?.kill();
        retour = gsap.delayedCall(REPOS, () =>
          poser(MAISON, 2.6, "sine.inOut"),
        ) as unknown as gsap.core.Tween;
      };

      const onPointer = (event: PointerEvent) => {
        const sx = place.x * largeur;
        const sy = place.y * hauteur;
        if (Math.hypot(event.clientX - sx, event.clientY - sy) > RAYON) return;

        // Le coin le plus éloigné du curseur — et jamais celui qu'on occupe.
        let meilleur = COINS[0];
        let record = -1;
        for (const coin of COINS) {
          const dejaLa =
            Math.abs(coin.x - place.x) < 0.01 && Math.abs(coin.y - place.y) < 0.01;
          if (dejaLa) continue;
          const d = Math.hypot(
            coin.x * largeur - event.clientX,
            coin.y * hauteur - event.clientY,
          );
          if (d > record) {
            record = d;
            meilleur = coin;
          }
        }

        retour?.kill();
        // `back` lui donne ce petit dépassement de trajectoire qui fait qu'on
        // croit vraiment l'avoir raté de peu.
        poser(meilleur, 0.8, "back.out(1.5)");
        rentrer();
      };

      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("resize", mesurer);

      return () => {
        retour?.kill();
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", mesurer);
      };
    },
    { scope: cadre },
  );

  return (
    <div
      ref={cadre}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Ancré en haut à gauche ; GSAP le déplace en x/y, ce qui évite de
          recalculer une mise en page à chaque image. */}
      <div ref={soleil} className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid h-0 w-0 place-items-center">
          <span className="absolute h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,226,170,.55)_0%,rgba(244,196,138,.24)_50%,rgba(244,196,138,0)_72%)]" />
          <span className="absolute h-[5rem] w-[5rem] rounded-full bg-[#ffe6bd] shadow-[0_0_70px_26px_rgba(255,220,168,.5)]" />
        </div>
      </div>
    </div>
  );
}
