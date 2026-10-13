"use client";

import { useEffect, useRef, useState } from "react";
import type { Souvenir } from "@/app/data";
import { asset } from "@/lib/assets";
import { music } from "./music";
import { ExpandIcon, SpeakerIcon } from "./Ornaments";

type Props = {
  souvenir: Souvenir;
  n: number;
  total: number;
  /** La page est-elle ouverte sous les yeux en ce moment ? */
  active: boolean;
  onZoom: (s: Souvenir) => void;
};

/**
 * Un souvenir collé sur la page, avec ses coins photo et sa légende écrite à
 * la main. Le cadre prend exactement la forme de l'image (portrait, carré ou
 * paysage) : rien n'est recadré.
 *
 * Une vidéo ne joue que quand sa page est ouverte, en muet et en boucle. Le
 * haut-parleur lui rend le son ; dès qu'on tourne la page elle se tait.
 */
export default function MediaPage({ souvenir, n, total, active, onZoom }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ratio, setRatio] = useState(souvenir.kind === "video" ? 9 / 16 : 3 / 4);
  const [wantsSound, setWantsSound] = useState(false);
  const sound = wantsSound && active;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = !sound;
    if (!sound) return;
    music.duck(true);
    return () => music.duck(false);
  }, [sound]);

  // Une vidéo perd sa demande de son quand on quitte sa page.
  useEffect(() => {
    if (active) return;
    const id = window.setTimeout(() => setWantsSound(false), 0);
    return () => window.clearTimeout(id);
  }, [active]);

  const tilt = n % 2 === 0 ? 1.3 : -1.1;

  return (
    <div className="page page-media">
      <header className="runhead">
        <span>Souvenir n° {n}</span>
        <span className="runhead-sep" aria-hidden="true">·</span>
        <span>sur {total}</span>
      </header>

      <div className="media-area">
        <figure
          className="mount"
          style={{ "--ar": ratio, "--tilt": `${tilt}deg` } as React.CSSProperties}
        >
          <button
            type="button"
            className="mount-photo"
            onClick={() => onZoom(souvenir)}
            aria-label="Voir ce souvenir en grand"
            data-zoom
          >
            {souvenir.kind === "photo" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={asset(souvenir.src)}
                alt={souvenir.alt}
                draggable={false}
                loading="lazy"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth) setRatio(img.naturalWidth / img.naturalHeight);
                }}
              />
            ) : (
              <video
                ref={videoRef}
                src={asset(souvenir.src)}
                poster={asset(souvenir.poster)}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={souvenir.alt}
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  if (v.videoWidth) setRatio(v.videoWidth / v.videoHeight);
                  if (active) void v.play().catch(() => {});
                }}
              />
            )}
            <span className="corner c-tl" aria-hidden="true" />
            <span className="corner c-tr" aria-hidden="true" />
            <span className="corner c-bl" aria-hidden="true" />
            <span className="corner c-br" aria-hidden="true" />
          </button>

          <div className="media-tools">
            {souvenir.kind === "video" && (
              <button
                type="button"
                className="tool"
                onClick={() => setWantsSound((s) => !s)}
                aria-label={sound ? "Couper le son de la vidéo" : "Mettre le son de la vidéo"}
                aria-pressed={sound}
              >
                <SpeakerIcon on={sound} className="tool-icon" />
              </button>
            )}
            <button
              type="button"
              className="tool"
              onClick={() => onZoom(souvenir)}
              aria-label="Plein écran"
            >
              <ExpandIcon className="tool-icon" />
            </button>
          </div>
        </figure>
      </div>

      <p className="caption">{souvenir.caption}</p>
    </div>
  );
}
