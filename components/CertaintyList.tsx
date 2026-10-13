import Reveal from "./Reveal";
import { CERTAINTIES } from "@/app/data";

/**
 * Les certitudes ne sont pas des cartes : c'est une liste, parce que ça se lit
 * comme une liste — une chose après l'autre, sans hiérarchie entre elles.
 */
export default function CertaintyList() {
  return (
    <ul className="certainty-grid mx-auto max-w-4xl">
      {CERTAINTIES.map((certainty, i) => (
        <li key={certainty.lead}>
          <Reveal delay={i * 70}>
            <div className="certainty-item group">
              <span
                aria-hidden="true"
                className="certainty-index"
              />
              <p>
                <strong>
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
