"use client";

import { useRef, useState } from "react";
import { HeartShape } from "./Ornaments";

type Burst = { id: number; dx: number; dy: number; r: number; s: number; d: number };

const MOTS = ["Appuie ici", "Encore ?", "Toujours.", "Moi aussi.", "Je sais."];

/** Un cœur violet à toucher. Il éclate en petits cœurs à chaque fois. */
export default function HeartButton() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [count, setCount] = useState(0);
  const next = useRef(0);

  function pop() {
    const fresh: Burst[] = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 46 + Math.random() * 46;
      return {
        id: next.current++,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 20,
        r: Math.random() * 60 - 30,
        s: 0.5 + Math.random() * 0.7,
        d: Math.random() * 120,
      };
    });
    setBursts((b) => [...b, ...fresh]);
    setCount((c) => c + 1);
    const ids = new Set(fresh.map((f) => f.id));
    window.setTimeout(() => setBursts((b) => b.filter((x) => !ids.has(x.id))), 1400);
  }

  return (
    <div className="heart-wrap">
      <button type="button" className="heart-btn" onClick={pop} aria-label="Envoyer un cœur">
        <HeartShape className="heart-main" />
        {bursts.map((b) => (
          <span
            key={b.id}
            className="heart-bit"
            style={
              {
                "--dx": `${b.dx}px`,
                "--dy": `${b.dy}px`,
                "--r": `${b.r}deg`,
                "--s": b.s,
                animationDelay: `${b.d}ms`,
              } as React.CSSProperties
            }
          >
            <HeartShape className="heart-bit-svg" />
          </span>
        ))}
      </button>
      <p className="heart-label" aria-live="polite">
        {MOTS[Math.min(count, MOTS.length - 1)]}
      </p>
    </div>
  );
}
