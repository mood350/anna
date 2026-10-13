/**
 * Les petits dessins du livre : la violette de la couverture, les fleurons,
 * les icônes des envies grecques et la vignette de Santorin.
 * Tout est en SVG et suit `currentColor`, sauf la vignette qui a ses couleurs.
 */

type P = { className?: string };

/** Une violette en trait fin — la fleur qui a donné son nom à la couleur. */
export function Violet({ className }: P) {
  return (
    <svg viewBox="-40 -44 80 96" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M0 14 C 2 26, -3 36, 2 50" />
      <path d="M1 32 C 10 26, 20 28, 24 34 C 16 38, 8 37, 1 32 Z" />
      <path d="M-1 40 C -10 35, -19 37, -22 43 C -14 46, -7 45, -1 40 Z" />
      <ellipse cx="-8" cy="-14" rx="9" ry="15" transform="rotate(-24 -8 -14)" />
      <ellipse cx="8" cy="-14" rx="9" ry="15" transform="rotate(24 8 -14)" />
      <ellipse cx="-15" cy="1" rx="7" ry="12" transform="rotate(-72 -15 1)" />
      <ellipse cx="15" cy="1" rx="7" ry="12" transform="rotate(72 15 1)" />
      <ellipse cx="0" cy="11" rx="10" ry="10" />
      <path d="M-4 6 L0 13 L4 6" />
      <circle cx="0" cy="3" r="2.6" fill="currentColor" />
    </svg>
  );
}

/** Le filet orné qui sépare les titres du texte. */
export function Fleuron({ className }: P) {
  return (
    <svg viewBox="0 0 160 16" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden="true">
      <path d="M4 8 H62" opacity=".55" />
      <path d="M98 8 H156" opacity=".55" />
      <path d="M66 8 C 70 2, 76 2, 80 8 C 84 14, 90 14, 94 8" />
      <path d="M66 8 C 70 14, 76 14, 80 8 C 84 2, 90 2, 94 8" />
      <circle cx="80" cy="8" r="1.8" fill="currentColor" />
    </svg>
  );
}

/** Un coin de cadre en volute, pour la couverture. */
export function Corner({ className }: P) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
      <path d="M2 58 V14 C 2 7, 7 2, 14 2 H58" />
      <path d="M8 58 V18 C 8 12, 12 8, 18 8 H58" opacity=".6" />
      <path d="M14 22 C 14 16, 18 14, 22 14 C 28 14, 30 20, 26 24 C 23 27, 18 25, 19 21" />
      <circle cx="22" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function DomeIcon({ className }: P) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 5 V10" />
      <path d="M21 7.5 H27" />
      <path d="M12 24 C 12 16, 17.5 11, 24 11 C 30.5 11, 36 16, 36 24 Z" />
      <path d="M10 24 H38" />
      <path d="M12 24 V42 H36 V24" />
      <path d="M21 42 V34 C 21 32, 22.5 31, 24 31 C 25.5 31, 27 32, 27 34 V42" />
      <path d="M4 42 H44" />
    </svg>
  );
}

export function WaveIcon({ className }: P) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="34" cy="13" r="5" />
      <path d="M4 26 C 9 21, 14 21, 19 26 S 29 31, 34 26 S 41 21, 44 24" />
      <path d="M4 34 C 9 29, 14 29, 19 34 S 29 39, 34 34 S 41 29, 44 32" opacity=".7" />
      <path d="M4 42 C 9 37, 14 37, 19 42 S 29 47, 34 42" opacity=".45" />
    </svg>
  );
}

export function ColumnIcon({ className }: P) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 6 H38" />
      <path d="M12 6 C 12 10, 16 11, 16 11 H32 C 32 11, 36 10, 36 6" />
      <path d="M16 11 V38 M22 11 V38 M26 11 V38 M32 11 V38" />
      <path d="M13 38 H35 V42 H13 Z" />
      <path d="M9 42 H39" />
    </svg>
  );
}

export function OliveIcon({ className }: P) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 42 C 16 34, 26 22, 42 8" />
      <path d="M14 35 C 10 30, 10 25, 13 22 C 16 26, 16 31, 14 35 Z" />
      <path d="M21 29 C 25 26, 30 26, 33 29 C 29 32, 24 32, 21 29 Z" />
      <path d="M25 23 C 22 18, 23 13, 26 11 C 28 15, 28 20, 25 23 Z" />
      <path d="M33 17 C 37 15, 41 16, 43 19 C 39 21, 35 20, 33 17 Z" />
      <ellipse cx="18" cy="38" rx="3" ry="4" transform="rotate(30 18 38)" fill="currentColor" opacity=".35" />
    </svg>
  );
}

export const WISH_ICONS = {
  dome: DomeIcon,
  wave: WaveIcon,
  column: ColumnIcon,
  olive: OliveIcon,
} as const;

/**
 * Santorin au couchant, en vignette de chapitre. À cette heure-là le ciel de
 * l'Égée est violet et rose : la scène tient dans la palette du livre. Le
 * seul bleu franc est celui des dômes, parce que c'est lui qui dit « Grèce ».
 */
export function GreeceVignette({ className }: P) {
  return (
    <svg viewBox="0 0 320 190" className={className} role="img" aria-label="Santorin au coucher du soleil">
      <defs>
        <linearGradient id="gv-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b1a6b" />
          <stop offset=".55" stopColor="#8b45d6" />
          <stop offset="1" stopColor="#f3a6d8" />
        </linearGradient>
        <linearGradient id="gv-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#2e1065" />
        </linearGradient>
        <radialGradient id="gv-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff3d6" />
          <stop offset=".6" stopColor="#fbcfe8" />
          <stop offset="1" stopColor="#f0abfc" stopOpacity="0" />
        </radialGradient>
        <clipPath id="gv-clip">
          <path d="M0 190 V118 A160 118 0 0 1 320 118 V190 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#gv-clip)">
        <rect width="320" height="190" fill="url(#gv-sky)" />
        <circle cx="200" cy="112" r="46" fill="url(#gv-sun)" />
        <circle cx="200" cy="112" r="20" fill="#fff1dc" />
        <rect y="118" width="320" height="72" fill="url(#gv-sea)" />
        <g stroke="#f5d0fe" strokeLinecap="round" opacity=".55">
          <path d="M170 128 H230" strokeWidth="2" />
          <path d="M182 138 H220" strokeWidth="1.6" />
          <path d="M192 148 H210" strokeWidth="1.2" />
          <path d="M40 140 H80 M250 156 H290 M90 168 H130" strokeWidth="1" opacity=".6" />
        </g>
        {/* la falaise et le village */}
        <path d="M0 96 C 30 92, 60 98, 90 106 C 110 112, 120 120, 128 134 L 128 190 L 0 190 Z" fill="#4c1d95" />
        <path d="M0 120 C 30 118, 70 124, 100 136 L 112 190 L 0 190 Z" fill="#2e1065" />
        <g fill="#faf5ff">
          <rect x="10" y="82" width="18" height="14" />
          <rect x="30" y="86" width="14" height="12" />
          <rect x="48" y="90" width="20" height="12" />
          <rect x="70" y="96" width="14" height="12" />
          <rect x="18" y="100" width="22" height="14" />
          <rect x="44" y="104" width="16" height="12" />
          <rect x="64" y="110" width="20" height="12" />
          <rect x="88" y="112" width="14" height="10" />
        </g>
        <g fill="#2f54d9">
          <path d="M50 90 C 50 80, 66 80, 66 90 Z" />
          <path d="M20 100 C 20 92, 34 92, 34 100 Z" />
        </g>
        <g fill="#c4b5fd" opacity=".9">
          <rect x="14" y="86" width="3" height="4" />
          <rect x="54" y="94" width="3" height="4" />
          <rect x="26" y="104" width="3" height="4" />
          <rect x="70" y="114" width="3" height="4" />
        </g>
      </g>
    </svg>
  );
}

/* --------------------------- petites icônes ---------------------------- */

export function ChevronLeft({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5 L8 12 L15 19" />
    </svg>
  );
}

export function ChevronRight({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5 L16 12 L9 19" />
    </svg>
  );
}

export function NoteIcon({ on, className }: P & { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
      {!on && <path d="M3 3l18 18" />}
    </svg>
  );
}

export function ListIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M5 4 H16 C 18 4, 19 5, 19 7 V20 H8 C 6 20, 5 19, 5 17 Z" />
      <path d="M5 17 C 5 15, 6 14, 8 14 H19" />
      <path d="M9 8 H15" />
    </svg>
  );
}

export function SpeakerIcon({ on, className }: P & { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" />
      {on ? (
        <>
          <path d="M16.5 9 C 17.8 10.6, 17.8 13.4, 16.5 15" />
          <path d="M19 6.5 C 21.6 9.6, 21.6 14.4, 19 17.5" />
        </>
      ) : (
        <path d="M17 9.5 L21.5 14 M21.5 9.5 L17 14" />
      )}
    </svg>
  );
}

export function ExpandIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15" />
    </svg>
  );
}

export function CloseIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6 L18 18 M18 6 L6 18" />
    </svg>
  );
}

export function PlayIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5.5 V18.5 L19 12 Z" />
    </svg>
  );
}

export function HeartShape({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 20.5 C 12 20.5, 3 14.8, 3 8.6 C 3 5.8, 5.2 3.6, 7.9 3.6 C 9.7 3.6, 11.2 4.6, 12 6 C 12.8 4.6, 14.3 3.6, 16.1 3.6 C 18.8 3.6, 21 5.8, 21 8.6 C 21 14.8, 12 20.5, 12 20.5 Z" />
    </svg>
  );
}
