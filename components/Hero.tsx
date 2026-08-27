import SoftDivider from "./SoftDivider";
import { FRIEND, TAGLINE, SUN_HINT } from "@/app/data";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      {/* Halos décoratifs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="derive-tres-lente absolute -left-24 top-20 h-72 w-72 rounded-full bg-lilas-300/50 blur-3xl" />
        <div className="derive-lente absolute -right-16 top-44 h-80 w-80 rounded-full bg-lilas-400/35 blur-3xl" />
        <div className="derive-tres-lente absolute bottom-4 left-1/3 h-72 w-72 rounded-full bg-poudre-300/30 blur-3xl" />
      </div>

      <p
        className="entree text-xs font-bold uppercase tracking-[0.32em] text-lilas-600"
        style={{ "--entree-delay": "150ms" } as React.CSSProperties}
      >
        Une page qui n&rsquo;existe que pour une seule personne
      </p>

      <h1
        className="entree type-tendre-xl mt-4 font-display text-[5.5rem] font-light leading-[0.85] tracking-[-0.035em] text-lilas-700 sm:text-[11rem] lg:text-[15rem]"
        style={{ "--entree-delay": "400ms" } as React.CSSProperties}
      >
        {FRIEND}
      </h1>

      <div
        className="entree mt-8 w-full"
        style={{ "--entree-delay": "700ms" } as React.CSSProperties}
      >
        <SoftDivider />
      </div>

      <p
        className="entree mt-8 max-w-md text-balance text-base leading-relaxed text-encre-800/80 sm:text-lg"
        style={{ "--entree-delay": "900ms" } as React.CSSProperties}
      >
        {TAGLINE}
      </p>

      <div
        className="entree mt-10"
        style={{ "--entree-delay": "1150ms" } as React.CSSProperties}
      >
        <a
          href="#souvenirs"
          className="rounded-full bg-gradient-to-r from-lilas-600 to-lilas-700 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-lilas-700/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lilas-700/40 active:translate-y-0"
        >
          Voir les souvenirs
        </a>
      </div>

      <p
        className="entree mt-8 font-main text-xl text-lilas-500"
        style={{ "--entree-delay": "1400ms" } as React.CSSProperties}
      >
        {SUN_HINT}
      </p>

      <a
        href="#chapitre-un"
        aria-label="Descendre au premier chapitre"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-lilas-500 transition hover:text-lilas-700"
      >
        <svg
          viewBox="0 0 24 24"
          className="respire h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>
    </section>
  );
}
