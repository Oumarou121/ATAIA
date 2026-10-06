"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PLANS, PROJECTS, RESIDENCES, VILLAS, img, planFacts, planSub, planTitle, projectViews } from "@/lib/data";
import Photo from "./Photo";
import ProjectDialog from "./ProjectDialog";
import Reveal from "./Reveal";

const pad2 = (n) => String(n).padStart(2, "0");
const views = (n) => `${n} vue${n > 1 ? "s" : ""}`;

/**
 * Toutes les réalisations sous forme de cartes : les 6 projets, puis chaque villa et chaque résidence, puis les plans
 * d'urbanisme (PUR et SDAU). Un clic ouvre la fiche (ProjectDialog) : toutes les images et les informations disponibles.
 * Un lien #project-01 (ex. bouton du hero) ouvre directement la fiche du projet. Données : PROJECTS, VILLAS, RESIDENCES, PLANS.
 */
const villaItem = (g, type, chip) => ({
  type,
  id: g.slug,
  title: g.name,
  chip,
  sub: views(g.n),
  cta: "Voir les photos",
  src: img(g.slug, 0),
  dialog: {
    title: g.name,
    chip,
    sub: `${chip} · ${views(g.n)}`,
    images: Array.from({ length: g.n }, (_, i) => ({ src: img(g.slug, i), cap: `${g.name} — photo ${i + 1}` })),
  },
});

const ITEMS = [
  ...PROJECTS.map((p) => ({
    type: p.domain === "Urbanisme" ? "urbanisme" : "architecture",
    id: p.key,
    hash: `project-${p.n}`,
    title: p.title,
    chip: p.domain,
    sub: p.loc,
    cta: "Voir le projet",
    src: img(p.slug, p.main),
    dialog: {
      title: p.title,
      chip: p.kicker,
      sub: p.loc,
      desc: p.desc,
      facts: p.facts ?? p.details,
      notes: p.chapters?.map(({ label, note }) => ({ label, note })),
      images: projectViews(p),
    },
  })),
  ...VILLAS.map((g) => villaItem(g, "villas", "Villa")),
  ...RESIDENCES.map((g) => villaItem(g, "residences", "Résidence")),
  ...PLANS.map((p) => ({
    type: "urbanisme",
    id: `${p.slug}-${p.i}`,
    title: planTitle(p),
    chip: p.kind,
    sub: planSub(p),
    cta: "Voir la carte",
    plan: p,
    src: img(p.slug, p.i),
    dialog: {
      title: planTitle(p),
      chip: p.kind,
      sub: p.name,
      desc: p.cap,
      facts: planFacts(p),
      images: [{ src: img(p.slug, p.i), cap: p.cap }],
      plan: true,
    },
  })),
];

// Chaque carte appartient à un seul onglet : le domaine (Architecture, Urbanisme) ou le type d'habitat (Villas, Résidences).
const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "architecture", label: "Architecture" },
  { key: "villas", label: "Villas" },
  { key: "residences", label: "Résidences" },
  { key: "urbanisme", label: "Urbanisme" },
];
const countOf = (k) => (k === "all" ? ITEMS.length : ITEMS.filter((it) => it.type === k).length);

const SIZES = "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw";

function Card({ it, n, onOpen }) {
  const isPlan = Boolean(it.plan);
  return (
    <li>
      <button type="button" className="pc-card" onClick={(e) => onOpen(it, e.currentTarget)} aria-haspopup="dialog">
        <span className="pc-media">
          <span className={`frame real pc-frame${isPlan ? " is-plan" : ""}`}>
            <Photo src={it.src} sizes={SIZES} />
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
      </button>
    </li>
  );
}

export default function ProjectGrid() {
  const [filter, setFilter] = useState("all");
  const [current, setCurrent] = useState(null);
  const trigger = useRef(null);

  const onOpen = useCallback((it, el) => {
    trigger.current = el;
    setCurrent(it);
    if (it.hash) history.replaceState(null, "", `#${it.hash}`);
  }, []);

  const onClose = useCallback(() => {
    setCurrent(null);
    if (location.hash.startsWith("#project-")) history.replaceState(null, "", "#projects");
    trigger.current?.focus?.();
  }, []);

  // lien direct #project-01 : ouvre la fiche du projet
  useEffect(() => {
    const sync = () => {
      const it = ITEMS.find((x) => x.hash && `#${x.hash}` === location.hash);
      if (it) {
        trigger.current = null;
        setCurrent(it);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const list = filter === "all" ? ITEMS : ITEMS.filter((it) => it.type === filter);

  return (
    <section className="pgrid" id="projects" aria-label="Nos réalisations">
      <Reveal className="pgrid-head">
        <div>
          <span className="idx">+</span>
          <h2 className="pgrid-title">Nos réalisations</h2>
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
          <Card key={it.id} it={it} n={k + 1} onOpen={onOpen} />
        ))}
      </Reveal>

      <ProjectDialog key={current?.id} item={current?.dialog} onClose={onClose} />
    </section>
  );
}
