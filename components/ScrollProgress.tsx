"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Le fil en haut de la page : il dit où on en est dans la lettre.
 *
 * `scrub: true` colle la barre au défilement sans amortissement — un indicateur
 * de position doit être exact, pas joli. Il reste actif même quand le mouvement
 * est réduit : ce n'est pas une animation, c'est une information.
 */
export default function ScrollProgress() {
  const cadre = useRef<HTMLDivElement>(null);
  const barre = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!barre.current) return;

      gsap.fromTo(
        barre.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
    { scope: cadre },
  );

  return (
    <div
      ref={cadre}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] bg-lilas-200/40"
    >
      <div
        ref={barre}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-lilas-600 via-lilas-400 to-or-300 will-change-transform"
      />
    </div>
  );
}
