import Reveal from "./Reveal";
import { CERTAINTIES } from "@/app/data";

/**
 * Les certitudes ne sont pas des cartes : c'est une liste, parce que ça se lit
 * comme une liste — une chose après l'autre, sans hiérarchie entre elles.
 */
export default function CertaintyList() {
  return (
    <ul className="mx-auto max-w-2xl">
      {CERTAINTIES.map((certainty, i) => (
        <li key={certainty.lead}>
          <Reveal delay={i * 70}>
            <div className="group grid grid-cols-[auto_1fr] items-start gap-4 border-b border-lilas-300/70 py-5 first:border-t">
              <span
                aria-hidden="true"
                className="mt-[0.7rem] h-2 w-2 rounded-full bg-lilas-400 transition duration-300 group-hover:scale-150 group-hover:bg-poudre-400"
              />
              <p className="text-[0.98rem] leading-[1.8] text-encre-800/80 sm:text-lg">
                <strong className="font-semibold text-encre-900">
                  {certainty.lead}
                </strong>{" "}
                {certainty.body}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
