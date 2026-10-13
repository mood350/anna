import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  title: ReactNode;
  className?: string;
};

/** L'en-tête éditoriale commune à tous les chapitres. */
export default function ChapterTitle({ eyebrow, title, className = "" }: Props) {
  const chapitres: Record<string, string> = {
    un: "01",
    deux: "02",
    trois: "03",
    quatre: "04",
    cinq: "05",
  };
  const mot = eyebrow.toLowerCase().split(" ").at(-1) ?? "";
  const nombre = eyebrow.match(/\d+/)?.[0] ?? chapitres[mot] ?? "•";
  return (
    <Reveal className={`editorial-title ${className}`}>
      <span className="editorial-number" aria-hidden="true">{nombre}</span>
      <div>
        <p className="editorial-kicker">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </Reveal>
  );
}
