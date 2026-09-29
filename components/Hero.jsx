"use client";
import { PROJECTS, bg } from "@/lib/data";
import { pad, useSlider } from "@/hooks/useSlider";
import { useAutoplay } from "@/hooks/useAutoplay";
import Magnetic from "./Magnetic";
import AutoplayToggle from "./AutoplayToggle";

export default function Hero() {
  const { playing, canAutoplay, toggle } = useAutoplay();
  const s = useSlider({ count: PROJECTS.length, auto: 6500, playing });
  const p = PROJECTS[s.index];

  return (
    <section className="hero" id="hero" aria-label="Ouverture">
      <div
        className="slider"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Projets à la une"
        {...s.rootProps}
      >
        <div className="sl-track" style={s.trackStyle}>
          {PROJECTS.map((pr, i) => (
            <div key={pr.key} className={`frame real ${i === s.index ? "active " : ""}${bg(pr.slug, pr.main)}`} />
          ))}
        </div>
      </div>

      <div className="hero-in">
        <div className="hero-text">
          <span className="idx">{pad(s.index + 1)}</span>
          <h1>{p.title}</h1>
          <p className="loc">{p.kicker} — {p.loc}</p>
        </div>
        <div className="hero-ctrl">
          <div className="hero-ctrl-row">
            <Magnetic className="sl-btn" onClick={s.prev} aria-label="Image précédente">←</Magnetic>
            <span className="sl-counter">{pad(s.index + 1)} / {pad(s.count)}</span>
            <Magnetic className="sl-btn" onClick={s.next} aria-label="Image suivante">→</Magnetic>
          </div>
          <div className="hero-ctrl-row">
            <div className="hero-bar"><span style={{ width: `${((s.index + 1) / s.count) * 100}%` }} /></div>
            <AutoplayToggle playing={playing} canAutoplay={canAutoplay} onToggle={toggle} />
          </div>
          <a className="hero-down" href="#projects">Explorer les projets ↓</a>
        </div>
      </div>
    </section>
  );
}
