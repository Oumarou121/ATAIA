"use client";
import { useState } from "react";
import { RESIDENCES, VILLAS, img } from "@/lib/data";
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

      <Reveal className="vr-tabs d1" role="tablist" aria-label="Catégories">
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
      </Reveal>

      {TABS.map((t) => (
        <Reveal
          key={t.key}
          className="vr-grid"
          stagger
          threshold={0.05}
          role="tabpanel"
          id={`vr-panel-${t.key}`}
          aria-labelledby={`vr-tab-${t.key}`}
          hidden={tab !== t.key}
        >
          {t.groups.map((g) => {
            const group = Array.from({ length: g.n }, (_, i) => ({
              src: img(g.slug, i),
              cap: `${g.name} — photo ${i + 1}`,
            }));
            return (
              <Zoomable key={g.slug} src={img(g.slug, 0)} sizes="(max-width: 600px) 50vw, 340px" cap={group[0].cap} group={group} className="vr-card">
                {g.n > 1 && <span className="vr-count">+{g.n - 1}</span>}
                <p className="vr-name">{g.name}</p>
              </Zoomable>
            );
          })}
        </Reveal>
      ))}
    </section>
  );
}