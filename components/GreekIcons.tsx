/**
 * Le vocabulaire grec de la page, dessiné plutôt que photographié : un SVG
 * reste net à toutes les tailles, pèse quelques centaines d'octets, et se met
 * aux couleurs du site au lieu de leur résister.
 */

type IconProps = { className?: string };

/** Le dôme bleu d'une chapelle des Cyclades. */
export function DomeIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M6 20a10 10 0 0 1 20 0z" fill="currentColor" />
      <rect x="4" y="20" width="24" height="8" rx="1.5" fill="currentColor" opacity=".45" />
      <path d="M16 4v6M13.5 6.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Trois vagues, pour l'eau qu'on voit jusqu'au fond. */
export function WaveIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 11c3.2 0 3.2 3 6.5 3s3.3-3 6.5-3 3.2 3 6.5 3 3.3-3 6.5-3" />
      <path d="M3 18c3.2 0 3.2 3 6.5 3s3.3-3 6.5-3 3.2 3 6.5 3 3.3-3 6.5-3" opacity=".7" />
      <path d="M3 25c3.2 0 3.2 3 6.5 3s3.3-3 6.5-3 3.2 3 6.5 3 3.3-3 6.5-3" opacity=".4" />
    </svg>
  );
}

/** Une colonne ionique, pour les vieilles pierres. */
export function ColumnIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="5" y="3" width="22" height="3.5" rx="1" fill="currentColor" />
      <path
        d="M8 6.5c0 2 1.4 3 3 3s2.4-1 2.4-2.2M24 6.5c0 2-1.4 3-3 3s-2.4-1-2.4-2.2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="12" y="9.5" width="2" height="16" fill="currentColor" opacity=".85" />
      <rect x="15.2" y="9.5" width="2" height="16" fill="currentColor" opacity=".6" />
      <rect x="18.4" y="9.5" width="2" height="16" fill="currentColor" opacity=".85" />
      <rect x="6" y="25.5" width="20" height="3.5" rx="1" fill="currentColor" />
    </svg>
  );
}

/** Une branche d'olivier, pour les tables dehors. */
export function OliveIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M4 27C10 21 17 15 28 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <g fill="currentColor">
        <ellipse cx="11" cy="17" rx="4.2" ry="2.4" transform="rotate(-40 11 17)" opacity=".8" />
        <ellipse cx="17" cy="19" rx="4.2" ry="2.4" transform="rotate(20 17 19)" opacity=".65" />
        <ellipse cx="19" cy="10" rx="4.2" ry="2.4" transform="rotate(-40 19 10)" opacity=".8" />
        <ellipse cx="25" cy="12" rx="4.2" ry="2.4" transform="rotate(20 25 12)" opacity=".65" />
        <circle cx="14.5" cy="13" r="2.4" />
        <circle cx="22" cy="16.5" r="2" opacity=".75" />
      </g>
    </svg>
  );
}

/**
 * Le méandre — la frise grecque en spirale carrée. Un motif qui se répète, donc
 * un `<pattern>` : une seule tuile décrite, dessinée autant de fois qu'il faut.
 */
export function GreekKey({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 20"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="meandre" width="24" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M2 18V2h16v12H8V8h6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </pattern>
        <linearGradient id="meandre-fondu" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="22%" stopColor="white" stopOpacity="1" />
          <stop offset="78%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="meandre-masque">
          <rect width="240" height="20" fill="url(#meandre-fondu)" />
        </mask>
      </defs>
      {/* La frise s'éteint sur les bords au lieu d'être coupée net. */}
      <rect width="240" height="20" fill="url(#meandre)" mask="url(#meandre-masque)" />
    </svg>
  );
}
