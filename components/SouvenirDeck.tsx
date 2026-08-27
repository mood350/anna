"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import SouvenirLightbox from "./SouvenirLightbox";
import { ducker } from "./Soundtrack";
import { gsap, useGSAP, mouvementOk } from "@/lib/gsap";
import { asset } from "@/lib/assets";
import { SOUVENIRS, type Souvenir } from "@/app/data";

/**
 * Les souvenirs ne sont pas une grille mais un paquet de cartes, comme des
 * photos glissées dans l'enveloppe du début : on prend celle du dessus, on la
 * pousse sur le côté, la suivante apparaît.
 *
 * Trois façons d'avancer, pour que le geste soit naturel partout : glisser au
 * doigt ou à la souris, les flèches du clavier, les deux boutons.
 */

const TOTAL = SOUVENIRS.length;

/** Nombre de cartes visibles sous celle du dessus. */
const PROFONDEUR = 3;

/** Distance à parcourir avant qu'un glissement compte comme un lâcher. */
const SEUIL = 90;

/** Durée de l'envol d'une carte, alignée sur la transition CSS. */
const ENVOL = 320;

function modulo(n: number, m: number) {
  return ((n % m) + m) % m;
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      {muted ? (
        <path d="M16 9l5 6M21 9l-5 6" />
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      )}
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
    </svg>
  );
}

/** Le contenu d'une carte : la vidéo qui tourne, ou la photo. */
function Media({
  souvenir,
  actif,
  muted,
}: {
  souvenir: Souvenir;
  actif: boolean;
  muted: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Seule la carte du dessus joue : les autres restent sur leur vignette.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (actif) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [actif]);

  if (souvenir.kind === "video" && actif) {
    return (
      <video
        ref={videoRef}
        src={asset(souvenir.src)}
        poster={asset(souvenir.poster)}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="pointer-events-none h-full w-full object-cover"
      />
    );
  }

  return (
    <Image
      src={asset(souvenir.poster)}
      alt={souvenir.alt}
      fill
      sizes="(max-width: 640px) 78vw, 22rem"
      priority={actif}
      className="pointer-events-none object-cover"
      draggable={false}
    />
  );
}

export default function SouvenirDeck() {
  const [top, setTop] = useState(0);
  const [dx, setDx] = useState(0);
  const [drag, setDrag] = useState(false);
  const [envol, setEnvol] = useState<0 | 1 | -1>(0);
  const [muted, setMuted] = useState(true);
  const [zoom, setZoom] = useState<number | null>(null);

  const depart = useRef(0);
  const minuteries = useRef<number[]>([]);
  const pile = useRef<HTMLDivElement>(null);

  // Le paquet se pose en arrivant à l'écran, comme s'il était sorti d'une poche.
  useGSAP(
    () => {
      if (!pile.current || !mouvementOk()) return;
      gsap.from(pile.current, {
        y: 60,
        rotationX: 18,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: pile.current, start: "top 85%", once: true },
      });
    },
    { scope: pile },
  );

  useEffect(() => {
    const timers = minuteries.current;
    return () => {
      for (const id of timers) window.clearTimeout(id);
    };
  }, []);

  /** `sens` vaut +1 pour le souvenir suivant, -1 pour le précédent. */
  const avancer = useCallback(
    (sens: 1 | -1) => {
      if (envol !== 0) return;
      const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduit) {
        setDx(0);
        setTop((t) => modulo(t + sens, TOTAL));
        return;
      }

      // La carte sort du côté vers lequel on l'a poussée.
      setEnvol(sens === 1 ? -1 : 1);
      minuteries.current.push(
        window.setTimeout(() => {
          setTop((t) => modulo(t + sens, TOTAL));
          setEnvol(0);
          setDx(0);
        }, ENVOL),
      );
    },
    [envol],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (envol !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    depart.current = event.clientX;
    setDrag(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    setDx(event.clientX - depart.current);
  };

  const onPointerUp = () => {
    if (!drag) return;
    setDrag(false);
    if (dx <= -SEUIL) avancer(1);
    else if (dx >= SEUIL) avancer(-1);
    else setDx(0);
  };

  // Son coupé = la musique reprend sa place ; son activé = elle s'efface.
  useEffect(() => {
    if (muted) return;
    ducker(true);
    return () => ducker(false);
  }, [muted]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (zoom !== null) return; // la vue plein écran gère ses propres flèches
      if (event.key === "ArrowRight") avancer(1);
      if (event.key === "ArrowLeft") avancer(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [avancer, zoom]);

  // 640px suffisent largement pour sortir la carte de l'écran, et la valeur ne
  // dépend pas de `window` — donc le rendu serveur ne bronche pas.
  const decalage = envol !== 0 ? envol * 640 : dx;
  const rotation = decalage / 22;
  const opacite = envol !== 0 ? 0 : 1 - Math.min(Math.abs(dx) / 420, 0.35);

  return (
    <div className="flex flex-col items-center">
      {/* ---------- Le paquet ---------- */}
      <div
        ref={pile}
        className="relative h-[min(64svh,30rem)] w-[min(78vw,20rem)] select-none"
        style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
      >
        {Array.from({ length: PROFONDEUR + 1 }, (_, i) => {
          const index = modulo(top + i, TOTAL);
          const carte = SOUVENIRS[index];
          const actif = i === 0;

          const style = actif
            ? {
                // Elle pivote sur son axe vertical en même temps qu'elle part :
                // on sent qu'on soulève un objet, pas qu'on pousse une image.
                transform:
                  `translate3d(${decalage}px, ${Math.abs(decalage) * 0.05}px, ${
                    Math.abs(decalage) * 0.35
                  }px) rotate(${rotation}deg) rotateY(${-decalage * 0.045}deg)`,
                opacity: opacite,
                transition: drag
                  ? "none"
                  : `transform ${ENVOL}ms cubic-bezier(0.16,1,0.3,1), opacity ${ENVOL}ms ease-out`,
                zIndex: PROFONDEUR + 1,
                cursor: drag ? "grabbing" : "grab",
              }
            : {
                // Les cartes du dessous reculent vraiment dans la profondeur :
                // c'est la perspective qui les rétrécit, pas un `scale`. Elles
                // s'assombrissent aussi, comme ce qui s'éloigne d'une lumière.
                transform: `translate3d(0, ${i * 14}px, ${-i * 90}px) rotate(${
                  (i % 2 === 0 ? 1 : -1) * i * 1.6
                }deg)`,
                filter: `brightness(${1 - i * 0.12})`,
                transition: `transform ${ENVOL}ms cubic-bezier(0.16,1,0.3,1)`,
                zIndex: PROFONDEUR + 1 - i,
              };

          return (
            <div
              key={`${carte.src}-${i}`}
              style={style}
              onPointerDown={actif ? onPointerDown : undefined}
              onPointerMove={actif ? onPointerMove : undefined}
              onPointerUp={actif ? onPointerUp : undefined}
              onPointerCancel={actif ? onPointerUp : undefined}
              className="absolute inset-0 overflow-hidden rounded-[1.5rem] border border-white/70 bg-lilas-200 shadow-2xl shadow-lilas-700/25 touch-pan-y"
            >
              <Media souvenir={carte} actif={actif} muted={muted} />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-encre-900/80 via-encre-900/5 to-encre-900/20"
              />

              {actif && (
                <>
                  <div className="absolute right-3 top-3 flex gap-2">
                    {carte.kind === "video" && (
                      <button
                        type="button"
                        onClick={() => setMuted((m) => !m)}
                        aria-label={muted ? "Activer le son" : "Couper le son"}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25 text-white ring-1 ring-white/50 backdrop-blur-sm transition hover:bg-white/45"
                      >
                        <SoundIcon muted={muted} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setZoom(top)}
                      aria-label="Voir en grand"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25 text-white ring-1 ring-white/50 backdrop-blur-sm transition hover:bg-white/45"
                    >
                      <ExpandIcon />
                    </button>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
                    <p className="font-main text-2xl leading-tight text-white drop-shadow">
                      {carte.caption}
                    </p>
                    <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-lilas-200/85">
                      {carte.kind === "video" ? "Vidéo" : "Photo"}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------- Les commandes ---------- */}
      <div className="mt-8 flex items-center gap-5">
        <button
          type="button"
          onClick={() => avancer(-1)}
          aria-label="Souvenir précédent"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-lilas-300 bg-white/75 text-lilas-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <p
          aria-live="polite"
          className="min-w-[5.5rem] text-center text-sm font-semibold tabular-nums tracking-[0.18em] text-encre-800/70"
        >
          {String(top + 1).padStart(2, "0")}
          <span className="text-encre-800/35"> / {String(TOTAL).padStart(2, "0")}</span>
        </p>

        <button
          type="button"
          onClick={() => avancer(1)}
          aria-label="Souvenir suivant"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-lilas-300 bg-white/75 text-lilas-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ---------- Le rang de points : où on en est, et un accès direct ---------- */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {SOUVENIRS.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => {
              setDx(0);
              setTop(i);
            }}
            aria-label={`Aller au souvenir ${i + 1} : ${s.caption}`}
            aria-current={i === top}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === top ? "w-7 bg-lilas-600" : "w-2.5 bg-lilas-300 hover:bg-lilas-400"
            }`}
          />
        ))}
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-encre-800/45">
        Glisse la carte sur le côté
      </p>

      {zoom !== null && (
        <SouvenirLightbox
          index={zoom}
          onClose={() => setZoom(null)}
          onNavigate={(next) => setZoom(next)}
        />
      )}
    </div>
  );
}
