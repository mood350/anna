"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { burstPetals } from "./PetalRain";
import { OUVERTURE_EVENT } from "./Soundtrack";
import { FRIEND } from "@/app/data";

/**
 * Le rideau d'entrée : une enveloppe qu'il faut ouvrir pour accéder à la page.
 *
 * Elle n'apparaît qu'à la première visite. Le repère est posé dans
 * localStorage, et un script inline dans `layout.tsx` le lit AVANT le premier
 * rendu : c'est lui qui met `data-enveloppe="vue"` sur <html>, ce qui masque le
 * rideau en CSS. Sans ça, un visiteur qui revient verrait l'enveloppe clignoter
 * le temps que React s'hydrate.
 *
 * Conséquence : ce composant rend toujours le même HTML côté serveur et au
 * premier rendu client (sinon l'hydratation casse). C'est le CSS, puis
 * `useEffect`, qui décident de son sort.
 */

export const STORAGE_KEY = "anna:enveloppe";

type Etape = "fermee" | "ouverture" | "sortie" | "terminee";

/** Chronologie de l'ouverture, en millisecondes. */
const TEMPS = {
  rabat: 700,
  carte: 1250,
  fondu: 1850,
};

const TEMPS_REDUIT = {
  rabat: 0,
  carte: 120,
  fondu: 320,
};

export default function EnvelopeGate() {
  const [etape, setEtape] = useState<Etape>("fermee");
  const minuteries = useRef<number[]>([]);

  // Visiteur qui revient : le rideau reste monté mais `display: none` le retire
  // du flux et du parcours clavier. Pas besoin de le démonter, et surtout pas
  // en appelant setState depuis un effet.

  // Tant que le rideau est là, la page derrière ne doit pas défiler.
  useEffect(() => {
    if (etape === "terminee") return;
    if (document.documentElement.dataset.enveloppe === "vue") return;
    const precedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = precedent;
    };
  }, [etape]);

  useEffect(() => {
    const timers = minuteries.current;
    return () => {
      for (const id of timers) window.clearTimeout(id);
    };
  }, []);

  const ouvrir = useCallback(() => {
    if (etape !== "fermee") return;

    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = reduit ? TEMPS_REDUIT : TEMPS;

    setEtape("ouverture");

    minuteries.current.push(
      window.setTimeout(() => setEtape("sortie"), t.carte),
      window.setTimeout(() => {
        setEtape("terminee");
        // Le rideau est démonté : on peut enfin poser l'attribut, qui libère le
        // défilement et lance les animations d'entrée de la page.
        document.documentElement.dataset.enveloppe = "vue";
        try {
          localStorage.setItem(STORAGE_KEY, "vue");
        } catch {
          // Navigation privée ou stockage refusé : l'enveloppe reviendra à la
          // prochaine visite, ce n'est pas grave.
        }
        if (!reduit) {
          burstPetals(window.innerWidth / 2, window.innerHeight * 0.42, 120);
        }
        // Ce clic est le seul geste dont la musique a besoin pour démarrer.
        window.dispatchEvent(new Event(OUVERTURE_EVENT));
      }, t.fondu),
    );
  }, [etape]);

  if (etape === "terminee") return null;

  const ouverte = etape === "ouverture" || etape === "sortie";

  return (
    <div
      className={`enveloppe-gate fixed inset-0 z-[60] flex flex-col items-center justify-center gap-7 bg-lilas-100 px-6 py-10 transition-opacity duration-700 ${
        etape === "sortie" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Halos, pour que le fond ne soit pas un aplat mort */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="derive-tres-lente absolute -left-20 top-10 h-64 w-64 rounded-full bg-lilas-300/60 blur-3xl" />
        <div className="derive-lente absolute -right-16 bottom-12 h-72 w-72 rounded-full bg-poudre-300/45 blur-3xl" />
      </div>

      <p
        className={`relative font-main text-3xl text-lilas-600 transition-opacity duration-500 sm:text-4xl ${
          ouverte ? "opacity-0" : "opacity-100"
        }`}
      >
        Pour {FRIEND}
      </p>

      <button
        type="button"
        onClick={ouvrir}
        aria-label={`Ouvrir l'enveloppe adressée à ${FRIEND}`}
        className="enveloppe-scene relative w-[min(86vw,24rem)] shrink-0 rounded-2xl transition-transform duration-300 hover:-translate-y-1 active:translate-y-0"
      >
        <span className="relative block aspect-[3/2] w-full">
          {/* Doublure : ce qu'on aperçoit derrière la carte */}
          <span className="absolute inset-0 rounded-[0.9rem] bg-gradient-to-br from-lilas-500 to-lilas-700 shadow-2xl shadow-lilas-700/35" />

          {/* La carte, qui monte hors de l'enveloppe */}
          <span
            className={`absolute inset-x-[7%] bottom-[7%] top-[10%] rounded-lg bg-white px-4 py-5 text-center shadow-xl shadow-lilas-700/20 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              ouverte ? "-translate-y-[46%]" : "translate-y-0"
            }`}
          >
            <span className="type-tendre block font-display text-2xl font-light text-lilas-700 sm:text-3xl">
              {FRIEND}
            </span>
            <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-lilas-500">
              Ouvre-moi
            </span>
          </span>

          {/* La poche avant, en V — la carte glisse derrière */}
          <svg
            viewBox="0 0 300 200"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 z-20 h-full w-full drop-shadow-sm"
          >
            <defs>
              <linearGradient id="poche" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9a8e9" />
                <stop offset="100%" stopColor="#8b5fbf" />
              </linearGradient>
            </defs>
            <path
              d="M0 38 L150 133 L300 38 L300 190 Q300 200 290 200 L10 200 Q0 200 0 190 Z"
              fill="url(#poche)"
            />
          </svg>

          {/* Le rabat, qui bascule vers le haut */}
          <span
            className={`enveloppe-rabat absolute inset-x-0 top-0 h-[55%] origin-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              ouverte ? "z-0 [transform:rotateX(-172deg)]" : "z-30"
            }`}
          >
            <svg
              viewBox="0 0 300 110"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="h-full w-full"
            >
              <defs>
                <linearGradient id="rabat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dcc9ee" />
                  <stop offset="100%" stopColor="#b58fdf" />
                </linearGradient>
              </defs>
              <path d="M10 0 L290 0 Q300 0 300 10 L150 110 L0 10 Q0 0 10 0 Z" fill="url(#rabat)" />
            </svg>
          </span>

          {/* Le cachet de cire */}
          <span
            className={`absolute left-1/2 top-[46%] z-40 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-poudre-400 to-lilas-700 text-lg text-white shadow-lg shadow-lilas-700/40 transition-all duration-500 sm:h-14 sm:w-14 sm:text-2xl ${
              ouverte ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <span aria-hidden="true">&hearts;</span>
          </span>
        </span>
      </button>

      <p
        className={`relative text-xs font-semibold uppercase tracking-[0.28em] text-lilas-600 transition-opacity duration-500 ${
          ouverte ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="respire inline-block">Touche pour ouvrir</span>
      </p>
    </div>
  );
}
