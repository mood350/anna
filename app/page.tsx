import Hero from "@/components/Hero";
import EnvelopeGate from "@/components/EnvelopeGate";
import PetalRain from "@/components/PetalRain";
import Soundtrack from "@/components/Soundtrack";
import ScrollProgress from "@/components/ScrollProgress";
import SunChase from "@/components/SunChase";
import GreeceScene from "@/components/GreeceScene";
import { GreekKey, DomeIcon, WaveIcon, ColumnIcon, OliveIcon } from "@/components/GreekIcons";
import Reveal from "@/components/Reveal";
import ChapterTitle from "@/components/ChapterTitle";
import SouvenirDeck from "@/components/SouvenirDeck";
import CertaintyList from "@/components/CertaintyList";
import HeartButton from "@/components/HeartButton";
import {
  FRIEND,
  SIGNATURE,
  OPENING,
  ASIDE,
  TRAITS,
  LETTER,
  PULL_QUOTE,
  LETTER_END,
  SOUVENIRS,
  GREECE_INTRO,
  GREECE_WISHES,
  GREECE_PROMISE,
} from "./data";

/** Chaque envie porte le nom de son icône ; la correspondance se fait ici. */
const ICONES = {
  dome: DomeIcon,
  wave: WaveIcon,
  column: ColumnIcon,
  olive: OliveIcon,
} as const;

export default function Home() {
  return (
    <>
      <EnvelopeGate />
      <ScrollProgress />
      <SunChase />
      <PetalRain />
      <Soundtrack />

      <main className="relative z-10 flex-1">
        <Hero />

        {/* ---------- Chapitre un : le ton complice ---------- */}
        <section
          id="chapitre-un"
          className="mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-20 sm:py-28"
        >
          <ChapterTitle
            eyebrow="Chapitre un"
            title={
              <>
                D&rsquo;abord, <em className="italic text-lilas-700">soyons honnêtes</em>
              </>
            }
          />

          <Reveal delay={120}>
            <div className="mx-auto mt-10 max-w-2xl space-y-4 text-center text-[0.98rem] leading-[1.85] text-encre-800/85 sm:text-lg">
              {OPENING.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="pt-2 font-main text-2xl text-lilas-600">{ASIDE}</p>
            </div>
          </Reveal>

          <ul className="mt-14 grid gap-5 sm:grid-cols-3">
            {TRAITS.map((trait, i) => (
              <li key={trait.title}>
                <Reveal delay={i * 120}>
                  <article className="carte-petale h-full p-7 transition duration-300 hover:-translate-y-1.5">
                    <h3 className="type-tendre font-display text-2xl font-medium text-lilas-700">
                      {trait.title}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.8] text-encre-800/75">
                      {trait.body}
                    </p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Chapitre deux : les souvenirs ---------- */}
        <section
          id="souvenirs"
          className="mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-20 sm:py-28"
        >
          <ChapterTitle
            eyebrow={`${SOUVENIRS.length} moments`}
            title={
              <>
                Quelques <em className="italic text-lilas-700">preuves</em>
              </>
            }
          />

          <Reveal delay={100}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-center text-sm leading-relaxed text-encre-800/70 sm:text-base">
              Onze souvenirs, empilés comme des photos dans une enveloppe.
              Glisse celle du dessus pour passer à la suivante — les vidéos se
              lancent toutes seules, le bouton leur rend le son.
            </p>
          </Reveal>

          <div className="mt-12">
            <SouvenirDeck />
          </div>
        </section>

        {/* ---------- Chapitre trois : la lettre ---------- */}
        <section
          id="lettre"
          className="mx-auto w-full max-w-3xl scroll-mt-16 px-5 py-20 sm:py-28"
        >
          <ChapterTitle
            eyebrow="Chapitre trois"
            title={
              <>
                Ce que je ne <em className="italic text-lilas-700">dis jamais</em>
              </>
            }
          />

          <Reveal delay={120}>
            <div className="carte-petale mt-10 p-7 sm:p-11">
              <p className="font-main text-3xl text-lilas-600 sm:text-4xl">
                {FRIEND},
              </p>

              <div className="mt-5 space-y-4 text-[0.98rem] leading-[1.85] text-encre-800/85 sm:text-lg">
                {LETTER.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <blockquote className="type-tendre my-8 border-l-2 border-lilas-400 pl-6 font-display text-2xl font-light italic leading-snug text-lilas-700 sm:text-3xl">
                {PULL_QUOTE}
              </blockquote>

              <div className="space-y-4 text-[0.98rem] leading-[1.85] text-encre-800/85 sm:text-lg">
                {LETTER_END.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <p className="mt-9 text-right font-main text-3xl text-lilas-600">
                Merci d&rsquo;être là.
                <br />— {SIGNATURE}
              </p>
            </div>
          </Reveal>
        </section>

        {/* ---------- Chapitre quatre : les certitudes ---------- */}
        <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:py-28">
          <ChapterTitle
            eyebrow="Chapitre quatre"
            title={
              <>
                Les choses que <em className="italic text-lilas-700">je sais</em>
              </>
            }
          />

          <Reveal delay={100}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-center text-sm leading-relaxed text-encre-800/70 sm:text-base">
              Sans avoir besoin de vérifier, sans avoir besoin de demander.
            </p>
          </Reveal>

          <div className="mt-12">
            <CertaintyList />
          </div>
        </section>

        {/* ---------- Chapitre cinq : la Grèce ---------- */}
        <section id="grece" className="scroll-mt-16 pb-20 pt-10 sm:pb-28">
          <div className="mx-auto w-full max-w-6xl px-5">
            <ChapterTitle
              eyebrow="Chapitre cinq"
              title={
                <>
                  Un jour, <em className="italic text-lilas-700">la Grèce</em>
                </>
              }
            />
          </div>

          {/* La scène déborde des marges : c'est le seul endroit de la page qui
              va d'un bord à l'autre, et ça se remarque. */}
          <Reveal className="mt-12">
            <GreeceScene />
          </Reveal>

          <div className="mx-auto mt-10 w-full max-w-2xl px-5">
            <Reveal delay={120}>
              <GreekKey className="mx-auto h-4 w-full max-w-sm text-lilas-400" />

              <div className="mt-8 space-y-4 text-center text-[0.98rem] leading-[1.85] text-encre-800/85 sm:text-lg">
                {GREECE_INTRO.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>

          <ul className="mx-auto mt-14 grid w-full max-w-6xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-4">
            {GREECE_WISHES.map((envie, i) => {
              const Icone = ICONES[envie.icon];
              return (
                <li key={envie.title}>
                  <Reveal delay={i * 110}>
                    <article className="carte-petale h-full p-7 transition duration-300 hover:-translate-y-1.5">
                      <Icone className="h-9 w-9 text-egee-400" />
                      <h3 className="type-tendre mt-4 font-display text-xl font-medium text-lilas-700">
                        {envie.title}
                      </h3>
                      <p className="mt-2 text-sm leading-[1.8] text-encre-800/75">
                        {envie.body}
                      </p>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>

          <Reveal delay={140}>
            <p className="mx-auto mt-12 max-w-xl text-balance px-5 text-center font-main text-3xl text-lilas-600">
              {GREECE_PROMISE}
            </p>
          </Reveal>
        </section>

        {/* ---------- La fin ---------- */}
        <section className="px-5 pb-24 pt-6 text-center sm:pb-32">
          <Reveal>
            <div className="mx-auto max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-lilas-600">
                Il n&rsquo;y a pas de chapitre six
              </p>

              <p className="type-tendre-xl mt-5 font-display text-6xl font-light italic leading-[0.9] tracking-[-0.03em] text-lilas-700 sm:text-8xl">
                Toujours.
              </p>

              <p className="mx-auto mt-7 max-w-md text-balance text-sm leading-relaxed text-encre-800/70 sm:text-base">
                Le reste, on continuera de se le dire de vive voix — mal, en
                riant, comme d&rsquo;habitude.
              </p>

              <div className="mt-8">
                <HeartButton />
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="relative z-10 border-t border-lilas-300/70 bg-white/45 px-5 py-9 text-center backdrop-blur">
        <p className="font-main text-2xl text-lilas-600">Pour {FRIEND}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-encre-800/50">
          Fait à la main · avec beaucoup d&rsquo;affection
        </p>
      </footer>
    </>
  );
}
