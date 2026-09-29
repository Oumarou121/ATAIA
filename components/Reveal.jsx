"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Apparition au scroll : ajoute la classe "shown" quand l'élément entre dans l'écran.
 * Trois variantes, toutes réglées dans globals.css (bloc REVEAL) :
 *   (défaut)  fondu + montée légère : textes et blocs
 *   img       rideau qui se lève : grandes images
 *   stagger   les enfants directs apparaissent à la suite : listes, grilles, cartes
 * `threshold` : part visible requise (baisser pour les conteneurs très hauts).
 * Accepte une `ref` externe (fusionnée) pour pouvoir être combiné avec useSlider.
 */
export default function Reveal({
  as: Tag = "div",
  img = false,
  stagger = false,
  threshold = 0.16,
  className = "",
  shown = false,
  ref: extRef,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [on, setOn] = useState(shown);

  const setRef = (node) => {
    ref.current = node;
    if (typeof extRef === "function") extRef(node);
    else if (extRef) extRef.current = node;
  };

  useEffect(() => {
    if (on) return;
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduce || !("IntersectionObserver" in window)) { setOn(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }),
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [on, threshold]);

  return (
    <Tag ref={setRef} className={`${stagger ? "rv-stagger" : img ? "rv-img" : "rv"} ${on ? "shown" : ""} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
