"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, mouvementOk } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  /** Retard en millisecondes avant l'apparition. */
  delay?: number;
  className?: string;
};

/**
 * Fait apparaître son contenu quand il entre dans le viewport.
 *
 * Le contenu bascule légèrement vers l'avant en plus de monter : quelques
 * degrés sur l'axe X suffisent pour que ça ne ressemble plus à un simple fondu.
 */
export default function Reveal({ children, delay = 0, className = "" }: Props) {
  const cadre = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = cadre.current;
      if (!el) return;

      if (!mouvementOk()) {
        gsap.set(el, { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 34, rotationX: -7, transformPerspective: 900 },
        {
          autoAlpha: 1,
          y: 0,
          rotationX: 0,
          duration: 1,
          delay: delay / 1000,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        },
      );
    },
    { scope: cadre, dependencies: [delay] },
  );

  // `invisible` évite le clignotement entre le premier rendu et la prise en
  // main par GSAP ; `autoAlpha` le lève lui-même.
  return (
    <div ref={cadre} className={`invisible ${className}`}>
      {children}
    </div>
  );
}
