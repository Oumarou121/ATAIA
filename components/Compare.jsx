"use client";
import { useRef, useState } from "react";
import { img } from "@/lib/data";
import Photo from "./Photo";

/** Comparateur à curseur : deux vues d'un même projet. */
export default function Compare({ slug, before = 0, after = 1, labels = ["Vue 1", "Vue 2"], ratio, position }) {
  const [pct, setPct] = useState(50);
  const root = useRef(null);
  const down = useRef(false);
  const clamp = (v) => Math.max(0, Math.min(100, v));
  const fromX = (x) => {
    const r = root.current.getBoundingClientRect();
    setPct(clamp(((x - r.left) / r.width) * 100));
  };

  return (
    <div
      ref={root}
      className="compare"
      style={ratio ? { aspectRatio: ratio } : undefined}
      role="group"
      aria-label="Comparateur de deux vues du projet"
      onPointerMove={(e) => down.current && fromX(e.clientX)}
      onPointerUp={() => (down.current = false)}
      onPointerLeave={() => (down.current = false)}
      onClick={(e) => { if (!e.target.closest(".cmp-handle")) fromX(e.clientX); }}
    >
      <div className="frame real cmp-before">
        <Photo src={img(slug, before)} sizes="100vw" position={position} />
        <span className="cmp-label">{labels[0]}</span>
      </div>
      <div className="frame real cmp-after" style={{ clipPath: `inset(0 0 0 ${pct}%)` }}>
        <Photo src={img(slug, after)} sizes="100vw" position={position} />
        <span className="cmp-label">{labels[1]}</span>
      </div>
      <div
        className="cmp-handle"
        style={{ left: `${pct}%` }}
        role="slider"
        tabIndex={0}
        aria-label="Position du comparateur"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        onPointerDown={(e) => { down.current = true; e.currentTarget.setPointerCapture?.(e.pointerId); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") { e.preventDefault(); setPct((p) => clamp(p - 5)); }
          else if (e.key === "ArrowRight") { e.preventDefault(); setPct((p) => clamp(p + 5)); }
          else if (e.key === "Home") { e.preventDefault(); setPct(0); }
          else if (e.key === "End") { e.preventDefault(); setPct(100); }
        }}
      />
    </div>
  );
}
