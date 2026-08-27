"use client";

import { useRef } from "react";
import { gsap, useGSAP, mouvementOk } from "@/lib/gsap";

/**
 * Santorin au couchant, en vraie 3D.
 *
 * Les plans ne sont pas décalés par un multiplicateur : ils sont posés à des
 * profondeurs réelles en `translateZ`, et c'est la perspective CSS qui calcule
 * le reste. Conséquence, la parallaxe est juste dans tous les sens — au
 * défilement, mais aussi quand la caméra pivote sous le pointeur, ce qu'un
 * décalage vertical ne saurait pas faire.
 *
 * Pourquoi pas WebGL : la scène est un empilement d'illustrations plates. Les
 * transformations 3D du navigateur les gèrent nativement, sans contexte à
 * initialiser ni bibliothèque de 150 ko à télécharger sur un téléphone.
 *
 * Le couchant n'est pas décoratif : à cette heure-là le ciel de l'Égée est
 * violet et rose, donc la scène tient dans la palette du site. Le seul bleu
 * franc est celui des dômes — c'est lui qui dit « Grèce ».
 */

/** Distance œil-écran. Plus c'est petit, plus la perspective est marquée. */
const PERSPECTIVE = 900;

/**
 * Un plan enfoncé de `z` doit être agrandi d'autant, sinon il rétrécit et
 * découvre les bords. C'est la formule de la perspective, à l'envers.
 */
function compenser(z: number) {
  return (PERSPECTIVE + z) / PERSPECTIVE;
}

type CoucheProps = {
  /** Profondeur en pixels : positif = loin derrière, négatif = devant. */
  z: number;
  children: React.ReactNode;
};

function Couche({ z, children }: CoucheProps) {
  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `translateZ(${-z}px) scale(${compenser(z)})`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

const SVG = "h-full w-full";

export default function GreeceScene() {
  const scene = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cam = camera.current;
      const cadre = scene.current;
      if (!cam || !cadre || !mouvementOk()) return;

      // La caméra suit le pointeur avec du retard : `quickTo` interpole vers la
      // dernière valeur reçue au lieu de créer une animation par mouvement.
      const versY = gsap.quickTo(cam, "rotationY", { duration: 0.9, ease: "power3" });
      const versX = gsap.quickTo(cam, "rotationX", { duration: 0.9, ease: "power3" });

      const onPointer = (event: PointerEvent) => {
        const rect = cadre.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        versY(x * 9);
        versX(-y * 5);
      };

      const onLeave = () => {
        versY(0);
        versX(0);
      };

      cadre.addEventListener("pointermove", onPointer);
      cadre.addEventListener("pointerleave", onLeave);

      // Le défilement fait avancer la caméra dans la scène et la redresse
      // légèrement : on entre dans le paysage plutôt que de le longer.
      gsap.fromTo(
        cam,
        { z: -160, rotationX: 4 },
        {
          z: 130,
          rotationX: -2,
          ease: "none",
          scrollTrigger: {
            trigger: cadre,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      // Le soleil monte un peu plus vite que le reste : c'est lui qu'on suit.
      gsap.to(".grece-soleil", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: cadre, start: "top bottom", end: "bottom top", scrub: 1 },
      });

      return () => {
        cadre.removeEventListener("pointermove", onPointer);
        cadre.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: scene },
  );

  return (
    <div
      ref={scene}
      className="relative h-[min(72svh,34rem)] w-full overflow-hidden bg-lilas-700"
      style={{ perspective: `${PERSPECTIVE}px` }}
    >
      <div
        ref={camera}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* --- Le ciel et le soleil, tout au fond --- */}
        <Couche z={900}>
          <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={SVG}>
            <defs>
              <linearGradient id="ciel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4b2a75" />
                <stop offset="38%" stopColor="#8b5fbf" />
                <stop offset="66%" stopColor="#d79bb5" />
                <stop offset="88%" stopColor="#f2c48a" />
                <stop offset="100%" stopColor="#f8dcae" />
              </linearGradient>
              <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#ffe9c0" stopOpacity=".95" />
                <stop offset="55%" stopColor="#f5c489" stopOpacity=".35" />
                <stop offset="100%" stopColor="#f5c489" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="1200" height="600" fill="url(#ciel)" />

            {/* Le couchant de la scène. Ce n'est pas le soleil fuyard de la
                page : celui-ci se couche sur la mer, et la traînée dorée en
                dessous part de lui. */}
            <g className="grece-soleil">
              <circle cx="880" cy="415" r="190" fill="url(#halo)" />
              <circle cx="880" cy="415" r="46" fill="#ffeccb" />
            </g>

            <g fill="#ffffff" opacity=".16">
              <ellipse cx="270" cy="150" rx="150" ry="12" />
              <ellipse cx="420" cy="196" rx="200" ry="10" />
              <ellipse cx="940" cy="128" rx="130" ry="9" />
              <ellipse cx="760" cy="248" rx="240" ry="11" />
            </g>
          </svg>
        </Couche>

        {/* --- Les îles au loin, dans la brume --- */}
        <Couche z={540}>
          <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={SVG}>
            <g fill="#7d5aa8" opacity=".5">
              <path d="M0 452 L120 408 L210 438 L330 452 Z" />
              <path d="M420 452 L520 412 L580 432 L660 452 Z" />
              <path d="M980 452 L1080 420 L1150 440 L1200 452 Z" />
            </g>
          </svg>
        </Couche>

        {/* --- La mer et le reflet --- */}
        <Couche z={270}>
          <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={SVG}>
            <defs>
              <linearGradient id="mer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7a6bb5" />
                <stop offset="45%" stopColor="#4b3f8e" />
                <stop offset="100%" stopColor="#2b2359" />
              </linearGradient>
            </defs>

            <rect y="450" width="1200" height="150" fill="url(#mer)" />

            {/* La traînée dorée : des traits de plus en plus larges vers le bas */}
            <g fill="#ffdca8" opacity=".55">
              <rect x="866" y="462" width="28" height="3" rx="1.5" />
              <rect x="852" y="478" width="56" height="3" rx="1.5" opacity=".85" />
              <rect x="836" y="496" width="88" height="4" rx="2" opacity=".7" />
              <rect x="818" y="518" width="124" height="4" rx="2" opacity=".5" />
              <rect x="798" y="544" width="164" height="5" rx="2.5" opacity=".35" />
              <rect x="776" y="574" width="208" height="5" rx="2.5" opacity=".22" />
            </g>

            <g stroke="#c9b6ec" strokeWidth="2.5" strokeLinecap="round" opacity=".35" fill="none">
              <path d="M60 494h70M240 512h90M470 484h64M120 552h110M380 566h130M600 528h80M1040 500h84M980 556h120" />
            </g>
          </svg>
        </Couche>

        {/* --- La falaise et les villages --- */}
        <Couche z={0}>
          <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={SVG}>
            <defs>
              <g id="maison">
                <rect x="0" y="0" width="34" height="26" rx="2" fill="#fbf7fe" />
                <rect x="0" y="0" width="34" height="4" rx="2" fill="#ffffff" />
                <rect x="7" y="10" width="7" height="9" rx="1" fill="#5b8fd4" />
                <rect x="20" y="10" width="7" height="9" rx="1" fill="#5b8fd4" opacity=".8" />
              </g>
              <g id="chapelle">
                <path d="M0 22a17 15 0 0 1 34 0z" fill="#5b8fd4" />
                <path d="M0 22a17 15 0 0 1 34 0z" fill="#ffffff" opacity=".18" />
                <rect x="-2" y="22" width="38" height="18" rx="2" fill="#fbf7fe" />
                <rect x="14" y="28" width="6" height="12" rx="1" fill="#5b8fd4" />
                <path d="M17 0v9M13 4h8" stroke="#fbf7fe" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            </defs>

            <path
              d="M0 600 L0 470 L90 436 L200 464 L300 430 L392 470 L470 452 L470 600 Z"
              fill="#3a2b52"
            />
            <path
              d="M760 600 L760 462 L850 430 L960 458 L1070 424 L1200 456 L1200 600 Z"
              fill="#3a2b52"
            />
            <path
              d="M760 462 L850 430 L960 458 L1070 424 L1200 456"
              stroke="#6b4d8f"
              strokeWidth="5"
              fill="none"
              strokeLinejoin="round"
            />

            <g>
              <use href="#maison" x="36" y="436" />
              <use href="#maison" x="86" y="446" transform="scale(0.86)" />
              <use href="#chapelle" x="150" y="420" />
              <use href="#maison" x="240" y="430" transform="scale(0.92)" />
              <use href="#maison" x="330" y="452" transform="scale(0.8)" />
            </g>

            <g>
              <use href="#maison" x="800" y="438" transform="scale(0.9)" />
              <use href="#chapelle" x="880" y="404" transform="scale(1.15)" />
              <use href="#maison" x="1000" y="440" />
              <use href="#maison" x="1080" y="428" transform="scale(0.85)" />
              <use href="#maison" x="1140" y="446" transform="scale(0.78)" />
            </g>
          </svg>
        </Couche>

        {/* --- La branche d'olivier, devant la caméra : c'est elle qui rend la
                profondeur lisible, parce qu'elle bouge à contresens du fond --- */}
        <Couche z={-190}>
          <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={SVG}>
            <g stroke="#2a1f35" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".9">
              <path d="M-30 40C120 70 210 130 250 210" />
              <path d="M120 66C150 96 156 128 150 156" strokeWidth="4" />
              <path d="M206 140C246 150 272 142 296 122" strokeWidth="4" />
            </g>
            <g fill="#2a1f35" opacity=".9">
              <ellipse cx="86" cy="42" rx="30" ry="12" transform="rotate(-24 86 42)" />
              <ellipse cx="146" cy="80" rx="28" ry="11" transform="rotate(16 146 80)" />
              <ellipse cx="148" cy="150" rx="26" ry="11" transform="rotate(-70 148 150)" />
              <ellipse cx="212" cy="150" rx="30" ry="12" transform="rotate(28 212 150)" />
              <ellipse cx="290" cy="118" rx="28" ry="11" transform="rotate(-18 290 118)" />
              <ellipse cx="238" cy="206" rx="26" ry="11" transform="rotate(62 238 206)" />
              <circle cx="176" cy="112" r="11" />
              <circle cx="262" cy="164" r="9" opacity=".8" />
            </g>
          </svg>
        </Couche>
      </div>

      {/* Le raccord avec la page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-lilas-50 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-lilas-50 to-transparent"
      />
    </div>
  );
}
