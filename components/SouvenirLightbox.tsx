"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ducker } from "./Soundtrack";
import { asset } from "@/lib/assets";
import { SOUVENIRS } from "@/app/data";

/** La vue plein écran : le souvenir en entier, sans recadrage, avec le son. */
export default function SouvenirLightbox({
  index,
  onClose,
  onNavigate,
}: {
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const souvenir = SOUVENIRS[index];
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    // L'ouverture vient d'un clic, donc le son est autorisé.
    videoRef.current?.play().catch(() => {});
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate((index + 1) % SOUVENIRS.length);
      if (event.key === "ArrowLeft")
        onNavigate((index - 1 + SOUVENIRS.length) % SOUVENIRS.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onNavigate]);

  // Le souvenir est en plein écran et parle : la musique s'efface derrière.
  useEffect(() => {
    ducker(true);
    return () => ducker(false);
  }, []);

  useEffect(() => {
    const precedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = precedent;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Souvenir ${index + 1} sur ${SOUVENIRS.length} : ${souvenir.caption}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-encre-900/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-full w-full max-w-[26rem] flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        {souvenir.kind === "video" ? (
          <video
            ref={videoRef}
            key={souvenir.src}
            src={asset(souvenir.src)}
            poster={asset(souvenir.poster)}
            controls
            playsInline
            preload="metadata"
            className="max-h-[76svh] w-full rounded-3xl bg-black shadow-2xl shadow-black/50"
          />
        ) : (
          // `unoptimized` court-circuite le loader : c'est à nous d'ajouter
          // le basePath.
          <Image
            key={souvenir.src}
            src={asset(souvenir.src)}
            alt={souvenir.alt}
            width={1080}
            height={1440}
            className="max-h-[76svh] w-auto rounded-3xl object-contain shadow-2xl shadow-black/50"
          />
        )}

        <p className="mt-4 text-balance text-center font-main text-2xl text-lilas-200">
          {souvenir.caption}
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lilas-300/60">
          {index + 1} / {SOUVENIRS.length}
        </p>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute -top-3 right-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-encre-900 shadow-lg transition hover:bg-white sm:-right-3"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Souvenir précédent"
          onClick={() =>
            onNavigate((index - 1 + SOUVENIRS.length) % SOUVENIRS.length)
          }
          className="absolute -left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-encre-900 shadow-lg transition hover:bg-white sm:-left-16"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Souvenir suivant"
          onClick={() => onNavigate((index + 1) % SOUVENIRS.length)}
          className="absolute -right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-encre-900 shadow-lg transition hover:bg-white sm:-right-16"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
