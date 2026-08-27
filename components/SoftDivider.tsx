/**
 * Un filet qui s'éteint sur les bords, avec un petit losange au centre.
 * Sert à respirer entre l'intitulé d'un chapitre et son contenu.
 */
export default function SoftDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto flex w-full max-w-xs items-center gap-3 ${className}`}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-lilas-300" />
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-lilas-400" fill="currentColor">
        <path d="M6 0l1.6 4.4L12 6l-4.4 1.6L6 12l-1.6-4.4L0 6l4.4-1.6z" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-lilas-300" />
    </div>
  );
}
