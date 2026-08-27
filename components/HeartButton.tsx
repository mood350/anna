"use client";

import { useState, type MouseEvent } from "react";
import { burstPetals } from "./PetalRain";

/**
 * Le seul élément vraiment inutile de la page — et donc le plus important.
 * Chaque clic renvoie une réponse un peu moins sérieuse que la précédente.
 */
const REPONSES = [
  "",
  "encore une fois",
  "tu peux continuer",
  "ça ne s’arrête pas",
  "sérieusement, ça ne s’arrête pas",
  "voilà, tu as compris l’idée",
];

export default function HeartButton() {
  const [count, setCount] = useState(0);

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    burstPetals(rect.left + rect.width / 2, rect.top + rect.height / 2, 90);
    setCount((n) => n + 1);
  };

  const mot = REPONSES[Math.min(count, REPONSES.length - 1)];

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        aria-label="Envoyer un peu d'affection"
        className="rounded-full p-3 text-4xl leading-none text-poudre-400 transition duration-300 hover:scale-115 active:scale-90"
      >
        <span aria-hidden="true">&hearts;</span>
      </button>

      <p
        role="status"
        className="min-h-[1.4em] text-xs font-semibold uppercase tracking-[0.22em] text-encre-800/55"
      >
        {count > 0 && `${count} fois${mot ? ` — ${mot}` : ""}`}
      </p>
    </div>
  );
}
