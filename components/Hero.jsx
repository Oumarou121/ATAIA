"use client";
import { PROJECTS, SITE, img } from "@/lib/data";
import { pad, useSlider } from "@/hooks/useSlider";
import { useAutoplay } from "@/hooks/useAutoplay";
import Photo from "./Photo";
import AutoplayToggle from "./AutoplayToggle";

export default function Hero() {
  const { playing, canAutoplay, toggle } = useAutoplay();
  const s = useSlider({ count: PROJECTS.length, auto: 6500, playing });
  const p = PROJECTS[s.index];

  return (
    <section className="hero hh" id="hero" aria-label="Ouverture">
      {/* Fond : fondu enchaîné entre les projets, avec un léger zoom lent */}
      <div
        className="slider hh-stage"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Projets à la une"
        {...s.rootProps}
      >
        {PROJECTS.map((pr, i) => (
          <div
            key={pr.key}
            className={`frame real hh-slide${i === s.index ? " active" : ""}`}
            aria-hidden={i === s.index ? undefined : true}
          >
            {(i === 0 || s.isNear(i)) && (
              <Photo
                src={img(pr.slug, pr.main)}
                sizes="100vw"
                preload={i === 0}
                alt={i === s.index ? `${pr.title}, ${pr.loc}` : ""}
              />
            )}
          </div>
        ))}
      </div>

      <div className="hh-in">
        <div className="hh-cap">
          <h1 className="hh-over">
            <span>{SITE.tagline}</span>
            <span>{SITE.city}</span>
          </h1>
          <div className="hh-proj" key={p.key}>
            <p className="hh-title">{p.title}</p>
            <p className="hh-meta"><span>{p.n}</span>{p.kicker} — {p.loc}</p>
          </div>
          <div className="hh-cta">
            <a className="hh-btn" href={`#project-${p.n}`}>Voir le projet <span aria-hidden="true">→</span></a>
            <a className="hh-link" href="#projects">Tous les projets <span aria-hidden="true">↓</span></a>
          </div>
        </div>

        <div className="hh-nav" role="group" aria-label="Choisir un projet à la une">
          <div className="hh-thumbs">
            {PROJECTS.map((pr, i) => (
              <button
                key={pr.key}
                type="button"
                className={`hh-thumb${i === s.index ? " active" : ""}`}
                aria-label={`${pad(i + 1)} — ${pr.title}`}
                aria-current={i === s.index ? "true" : undefined}
                onClick={() => s.goTo(i)}
              >
                <span className="frame real"><Photo src={img(pr.slug, pr.main)} sizes="140px" /></span>
                <span className="hh-thumb-n">{pad(i + 1)}</span>
              </button>
            ))}
          </div>
          <div className="hh-foot">
            <span className="sl-counter">{pad(s.index + 1)} / {pad(s.count)}</span>
            <AutoplayToggle playing={playing} canAutoplay={canAutoplay} onToggle={toggle} />
          </div>
        </div>
      </div>
    </section>
  );
}
