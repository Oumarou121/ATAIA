"use client";
import { useState } from "react";
import { RESIDENCES, VILLAS, img } from "@/lib/data";
import { Zoomable } from "./Lightbox";
import Reveal from "./Reveal";

const TABS = [
  { key: "villas", label: "Villas", groups: VILLAS },
  { key: "residences", label: "Résidences", groups: RESIDENCES },
];

const pad2 = (n) => String(n).padStart(2, "0");
const views = (n) => `${n} vue${n > 1 ? "s" : ""}`;
const sum = (groups) => groups.reduce((t, g) => t + g.n, 0);

/**
 * Rythme éditorial sur 12 colonnes : rangées alternées de 2 cartes (7+5, puis 5+7)
 * et de 3 cartes (4+4+4). Fonctionne pour n'importe quel nombre de projets :
 * s'il reste 1 carte, elle prend toute la largeur ; s'il en reste 2, rangée de 2.
 */
function spansFor(n) {
  const out = [];
  let row = 0, flip = false, rest = n;
  while (rest > 0) {
    if (row % 2 === 0 || rest < 3) {
      if (rest === 1) { out.push(12); rest = 0; }
      else { out.push(...(flip ? [5, 7] : [7, 5])); flip = !flip; rest -= 2; }
    } else { out.push(4, 4, 4); rest -= 3; }
    row++;
  }
  return out;
}

export default function VillasResidences() {
  const [tab, setTab] = useState("villas");

  return (
    <section className="vr" id="villas-residences" aria-label="Villas et résidences">
      <Reveal className="vr-head">
        <div className="vr-head-main">
          <span className="idx">+</span>
          <h2 className="vr-title">Villas &amp; Résidences</h2>
        </div>
        <div className="vr-head-side">
          <p className="desc">Une sélection de villas privées et de résidences réalisées par l&apos;agence.</p>
          <dl className="vr-facts">
            {TABS.map((t) => (
              <div key={t.key}>
                <dt>{t.label}</dt>
                <dd>{pad2(t.groups.length)}<span> · {views(sum(t.groups))}</span></dd>
              </div>
            ))}
          </dl>
        </div>
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
            <span className="vr-tab-n">{pad2(t.groups.length)}</span>
          </button>
        ))}
      </Reveal>

      {TABS.map((t) => {
        const spans = spansFor(t.groups.length);
        return (
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
            {t.groups.map((g, k) => {
              const group = Array.from({ length: g.n }, (_, i) => ({
                src: img(g.slug, i),
                cap: `${g.name} — photo ${i + 1}`,
              }));
              return (
                <figure key={g.slug} className="vr-item" style={{ "--s": spans[k] }}>
                  <Zoomable
                    src={img(g.slug, 0)}
                    sizes={spans[k] > 6 ? "(max-width: 900px) 100vw, 720px" : "(max-width: 900px) 100vw, 420px"}
                    cap={group[0].cap}
                    group={group}
                    className="vr-card"
                  >
                    <span className="vr-open" aria-hidden="true">{g.n > 1 ? "Parcourir les vues" : "Agrandir"} →</span>
                  </Zoomable>
                  <figcaption className="vr-meta">
                    <span className="n">{pad2(k + 1)}</span>
                    <span className="name">{g.name}</span>
                    <span className="v">{views(g.n)}</span>
                  </figcaption>
                </figure>
              );
            })}
          </Reveal>
        );
      })}
    </section>
  );
}
