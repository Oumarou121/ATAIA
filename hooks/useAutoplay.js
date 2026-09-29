"use client";
import { useState, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribe = (cb) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/**
 * État lecture/pause d'un diaporama automatique (WCAG 2.2.2 : l'utilisateur doit
 * pouvoir l'arrêter). Si le système demande moins de mouvement, useSlider ne
 * lance déjà jamais l'autoplay : `canAutoplay` vaut alors false et le bouton
 * n'a plus lieu d'être affiché.
 */
export function useAutoplay() {
  const [playing, setPlaying] = useState(true);
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { playing, canAutoplay: !reduced, toggle: () => setPlaying((v) => !v) };
}
