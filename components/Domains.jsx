"use client";
import { useState } from "react";
import { DOMAINS, PROJECTS, img } from "@/lib/data";
import Photo from "./Photo";
import Reveal from "./Reveal";

const pad2 = (n) => String(n).padStart(2, "0");
const projectTitle = (slug) => PROJECTS.find((p) => p.slug === slug)?.title || "";

export default function Domains() {
  const [active, setActive] = useState(0);
  const cur = DOMAINS[active];

  // La sélection ne change que l'image d'illustration (décorative) : ce sont donc
  // de simples boutons dans une liste, pas un système d'onglets. Le survol et le
  // focus clavier activent aussi l'image, comme pour l'index des projets.
  return (
    <section className="domains" id="domains" aria-label="Domaines d'intervention">
      <Reveal className="dom-head">
        <span className="idx">+</span>
        <h2 className="dom-title">Domaines d&apos;intervention</h2>
      </Reveal>

      <div className="dom-row">
        <Reveal as="ul" stagger className="dom-list">
          {DOMAINS.map((d, i) => (
            <li key={d.title}>
              <button
                type="button"
                className={`dom-btn${active === i ? " active" : ""}`}
                aria-current={active === i ? "true" : undefined}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
              >
                <span className="dn">{pad2(i + 1)}</span>
                <span className="dtxt">
                  <span className="dt">{d.title}</span>
                  <span className="dd">{d.desc}</span>
                </span>
                <span className="darr" aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </Reveal>

        <Reveal className="dom-visual d2" aria-hidden="true">
          <div className="dom-frames">
            {DOMAINS.map((d, i) => (
              <div key={d.title} className={`frame real dom-frame${active === i ? " active" : ""}`}>
                <Photo src={img(d.slug, d.i)} sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
            ))}
          </div>
          <p className="dom-cap" key={active}>
            <b>{pad2(active + 1)}</b> {projectTitle(cur.slug)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
