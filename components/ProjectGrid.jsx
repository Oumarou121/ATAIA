"use client";
import { useState } from "react";
import { PROJECTS, RESIDENCES, VILLAS, img } from "@/lib/data";
import { useLightbox } from "./Lightbox";
import Photo from "./Photo";
import Reveal from "./Reveal";

const pad2 = (n) => String(n).padStart(2, "0");
const views = (n) => `${n} vue${n > 1 ? "s" : ""}`;

/**
 * Toutes les réalisations sous forme de cartes : les 6 projets (lien vers leur section détaillée),
 * puis chaque villa et chaque résidence (ouvre la visionneuse sur ses photos). Données : PROJECTS, VILLAS, RESIDENCES.
 */
const ITEMS = [
  ...PROJECTS.map((p) => ({
    type: "projects",
    id: p.key,
    title: p.title,
    chip: p.domain,
    sub: p.loc,
    cta: "Voir le projet",
    href: `#project-${p.n}`,
    src: img(p.slug, p.main),
  })),
  ...VILLAS.map((g) => ({ type: "villas", id: g.slug, title: g.name, chip: "Villa", sub: views(g.n), cta: "Parcourir les vues", g })),
  ...RESIDENCES.map((g) => ({ type: "residences", id: g.slug, title: g.name, chip: "Résidence", sub: views(g.n), cta: "Parcourir les vues", g })),
];

const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "projects", label: "Projets" },
  { key: "villas", label: "Villas" },
  { key: "residences", label: "Résidences" },
];
const countOf = (k) => (k === "all" ? ITEMS.length : ITEMS.filter((it) => it.type === k).length);

const SIZES = "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw";

function Card({ it, n }) {
  const { open } = useLightbox();
  const src = it.src ?? img(it.g.slug, 0);
  const inner = (
    <>
      <span className="pc-media">
        <span className="frame real pc-frame">
          <Photo src={src} sizes={SIZES} />
        </span>
        <span className="pc-chip">{it.chip}</span>
      </span>
      <span className="pc-meta">
        <span className="pc-n">{pad2(n)}</span>
        <span className="pc-t">{it.title}</span>
        <span className="pc-s">{it.sub}</span>
        <span className="pc-cta">
          {it.cta} <span aria-hidden="true">→</span>
        </span>
      </span>
    </>
  );

  if (it.href) {
    return (
      <li>
        <a className="pc-card" href={it.href}>
          {inner}
        </a>
      </li>
    );
  }

  const group = Array.from({ length: it.g.n }, (_, i) => ({ src: img(it.g.slug, i), cap: `${it.g.name} — photo ${i + 1}` }));
  return (
    <li>
      <button type="button" className="pc-card" onClick={(e) => open(e.currentTarget, group)} aria-haspopup="dialog">
        {inner}
      </button>
    </li>
  );
}

export default function ProjectGrid() {
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? ITEMS : ITEMS.filter((it) => it.type === filter);

  return (
    <section className="pgrid" id="projects" aria-label="Projets et réalisations">
      <Reveal className="pgrid-head">
        <div>
          <span className="idx">+</span>
          <h2 className="pgrid-title">Projets</h2>
        </div>
        <p className="pgrid-count" aria-live="polite">
          {pad2(list.length)} réalisation{list.length > 1 ? "s" : ""}
        </p>
      </Reveal>

      <div className="vr-tabs" role="group" aria-label="Filtrer les réalisations">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`vr-tab${filter === f.key ? " active" : ""}`}
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span className="vr-tab-n">{pad2(countOf(f.key))}</span>
          </button>
        ))}
      </div>

      <Reveal as="ul" stagger threshold={0.04} className="pgrid-list" key={filter}>
        {list.map((it, k) => (
          <Card key={it.id} it={it} n={k + 1} />
        ))}
      </Reveal>
    </section>
  );
}
