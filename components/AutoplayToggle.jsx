"use client";

/** Bouton Pause / Lecture d'un diaporama automatique. */
export default function AutoplayToggle({ playing, canAutoplay = true, onToggle, className = "" }) {
  if (!canAutoplay) return null;
  return (
    <button
      type="button"
      className={`hero-auto ap-toggle ${className}`.trim()}
      aria-label={playing ? "Mettre en pause le défilement automatique" : "Reprendre le défilement automatique"}
      onClick={onToggle}
    >
      {playing ? "Pause" : "Lecture"}
    </button>
  );
}
