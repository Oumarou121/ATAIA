"use client";
import { useState } from "react";
import { RESIDENCES, VILLAS, bg } from "@/lib/data";
import { Zoomable } from "./Lightbox";
import Reveal from "./Reveal";

const TABS = [
  { key: "villas", label: "Villas", groups: VILLAS },
  { key: "residences", label: "Résidences", groups: RESIDENCES },
];

export default function VillasResidences() {
  const [tab, setTab] = useState("villas");

  return (
    <section className="vr" id="villas-residences" aria-label="Villas et résidences">
      <Reveal className="vr-head">
        <span className="idx">+</span>
        <h2>Villas &amp; Résidences</h2>
        <p className="desc">Une sélection de villas privées et de résidences réalisées par l&apos;agence.</p>
      </Reveal>

      <div className="vr-tabs" role="tablist" aria-label="Catégories">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            id={`vr-tab-${t.key}`}
            aria-controls={`vr-panel-${t.key}`}
            aria-selected={tab === t.key}
            className={`vr-tab${tab === t.key ? " active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {TABS.map((t) => (
        <div
          key={t.key}
          className="vr-grid"
          role="tabpanel"
          id={`vr-panel-${t.key}`}
          aria-labelledby={`vr-tab-${t.key}`}
          hidden={tab !== t.key}
        >
          {t.groups.map((g) => (
            <div className="vr-card" key={g.slug}>
              <div className="vr-card-imgs">
                {Array.from({ length: g.n }, (_, i) => (
                  <Zoomable key={i} bg={bg(g.slug, i)} cap={`${g.name} — photo ${i + 1}`} />
                ))}
              </div>
              <p className="vr-name">{g.name}</p>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
