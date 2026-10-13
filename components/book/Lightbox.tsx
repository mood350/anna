"use client";

import { useEffect, useRef } from "react";
import type { Souvenir } from "@/app/data";
import { asset } from "@/lib/assets";
import { music } from "./music";
import { CloseIcon } from "./Ornaments";

/** Un souvenir en grand, sans recadrage, avec le son. */
export default function Lightbox({ souvenir, onClose }: { souvenir: Souvenir; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    music.duck(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      music.duck(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={souvenir.caption}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button ref={closeRef} type="button" className="lightbox-close" onClick={onClose} aria-label="Fermer">
        <CloseIcon className="tool-icon" />
      </button>
      <div className="lightbox-media">
        {souvenir.kind === "photo" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(souvenir.src)} alt={souvenir.alt} />
        ) : (
          <video
            src={asset(souvenir.src)}
            poster={asset(souvenir.poster)}
            controls
            autoPlay
            playsInline
            loop
          />
        )}
      </div>
      <p className="lightbox-caption">{souvenir.caption}</p>
    </div>
  );
}
