"use client";
import { useRef } from "react";
import { PROJECTS, bg } from "@/lib/data";
import { useDragScroll } from "@/hooks/useDragScroll";
import Reveal from "./Reveal";

export default function Explorer() {
  const track = useRef(null);
  useDragScroll(track);
  const scroll = (dx) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.current?.scrollBy({ left: dx, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <Reveal as="section" className="explorer" aria-label="Explorateur de projets">
      <div className="explorer-head">
        <p>Explorer les projets</p>
        <div className="sl-arrows">
          <button className="sl-btn" onClick={() => scroll(-360)} aria-label="Défiler vers la gauche">←</button>
          <button className="sl-btn" onClick={() => scroll(360)} aria-label="Défiler vers la droite">→</button>
        </div>
      </div>
      <div className="exp-track" ref={track} tabIndex={0} aria-label="Faites glisser pour parcourir">
        {PROJECTS.map((p) => (
          <a key={p.key} className="exp-card" href={`#project-${p.n}`} draggable={false}>
            <div className={`frame real ${bg(p.slug, p.main)}`} />
            <div className="exp-meta">
              <span><strong>{p.title}</strong>{p.domain}</span>
              <span>{p.n}</span>
            </div>
          </a>
        ))}
      </div>
    </Reveal>
  );
}
