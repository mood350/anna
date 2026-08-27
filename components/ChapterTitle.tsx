import type { ReactNode } from "react";
import Reveal from "./Reveal";
import SoftDivider from "./SoftDivider";

type Props = {
  eyebrow: string;
  title: ReactNode;
  className?: string;
};

/** L'en-tête commune à tous les chapitres : surtitre, titre, filet. */
export default function ChapterTitle({ eyebrow, title, className = "" }: Props) {
  return (
    <Reveal className={`text-center ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.32em] text-lilas-600">
        {eyebrow}
      </p>
      <h2 className="type-tendre mt-3 font-display text-3xl font-medium text-encre-900 text-balance sm:text-5xl">
        {title}
      </h2>
      <SoftDivider className="mt-6" />
    </Reveal>
  );
}
