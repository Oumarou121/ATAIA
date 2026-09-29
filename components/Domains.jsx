"use client";
import { useState } from "react";
import { DOMAINS, bg } from "@/lib/data";

export default function Domains() {
  const [active, setActive] = useState(0);

  // La sélection ne change que l'image d'illustration (décorative) : ce sont donc
  // de simples boutons dans une liste, pas un système d'onglets. Le focus clavier
  // active aussi l'image, comme pour l'index des projets.
  return (
    <section className="domains" id="domains" aria-label="Domaines d'intervention">
      <div className="dom-row">
        <ul className="dom-list">
          {DOMAINS.map((d, i) => (
            <li key={d.title}>
              <button
                type="button"
                className={`dom-btn${active === i ? " active" : ""}`}
                aria-current={active === i ? "true" : undefined}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="dt">{d.title}</span>
                <span className="dd">{d.desc}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="dom-frames" aria-hidden="true">
          {DOMAINS.map((d, i) => (
            <div key={d.title} className={`frame real dom-frame ${active === i ? "active " : ""}${bg(d.slug, d.i)}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
