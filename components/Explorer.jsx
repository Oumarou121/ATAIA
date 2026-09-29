"use client";
import { useRef } from "react";
import { PROJECTS, img } from "@/lib/data";
import { useDragScroll } from "@/hooks/useDragScroll";
import Reveal from "./Reveal";
import Photo from "./Photo";

export default function Explorer() {
  const track = useRef(null);
  useDragScroll(track);
  const scroll = (dx) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.current?.scrollBy({ left: dx, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="explorer" aria-label="Explorateur de projets">
      <Reveal className="explorer-head">
        <p>Explorer les projets</p>
        <div className="sl-arrows">
          <button className="sl-btn" onClick={() => scroll(-360)} aria-label="Défiler vers la gauche">←</button>
          <button className="sl-btn" onClick={() => scroll(360)} aria-label="Défiler vers la droite">→</button>
        </div>
      </Reveal>
      <Reveal stagger className="exp-track" ref={track} tabIndex={0} aria-label="Faites glisser pour parcourir">
        {PROJECTS.map((p) => (
          <a key={p.key} className="exp-card" href={`#project-${p.n}`} draggable={false}>
            <div className="frame real"><Photo src={img(p.slug, p.main)} sizes="(max-width: 900px) 240px, 400px" /></div>
            <div className="exp-meta">
              <span><strong>{p.title}</strong>{p.domain}</span>
              <span>{p.n}</span>
            </div>
          </a>
        ))}
      </Reveal>
    </section>
  );
}
