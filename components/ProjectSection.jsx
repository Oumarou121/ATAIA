"use client";
import { useEffect, useRef, useState } from "react";
import { PROJECTS, img, neighbours } from "@/lib/data";
import { pad, useSlider } from "@/hooks/useSlider";
import { useDragScroll } from "@/hooks/useDragScroll";
import { Zoomable } from "./Lightbox";
import Reveal from "./Reveal";
import Photo from "./Photo";
import Compare from "./Compare";
import Accordion from "./Accordion";

/* ---------- briques communes ---------- */

function Arrows({ s, vertical = false, labels = ["Image précédente", "Image suivante"] }) {
  return (
    <div className="sl-arrows" style={vertical ? { flexDirection: "column" } : undefined}>
      <button className="sl-btn" onClick={s.prev} aria-label={labels[0]}>{vertical ? "↑" : "←"}</button>
      <button className="sl-btn" onClick={s.next} aria-label={labels[1]}>{vertical ? "↓" : "→"}</button>
    </div>
  );
}
const Counter = ({ s }) => <span className="sl-counter">{pad(s.index + 1)} / {pad(s.count)}</span>;

function ProjectHead({ p }) {
  return (
    <Reveal className="proj-head">
      <div className="meta">
        <span className="idx">{p.n}</span>
        <h2>{p.title}</h2>
        <p className="loc"><span>{p.kicker}</span><span>{p.loc}</span></p>
        <p className="desc">{p.desc}</p>
      </div>
    </Reveal>
  );
}

function ProjectNav({ index }) {
  const { prev, next } = neighbours(index);
  return (
    <nav className="proj-nav" aria-label="Navigation entre projets">
      {prev ? (
        <a className="pn-prev" href={`#project-${prev.n}`}>
          <div className="frame real pn-frame"><Photo src={img(prev.slug, prev.main)} sizes="64px" /></div>
          <span><span className="pn-title">{prev.title}</span></span>
        </a>
      ) : (
        <span />
      )}
      <a className="pn-next" href={next.href ?? `#project-${next.n}`}>
        <div className="frame real pn-frame"><Photo src={img(next.slug, next.main)} sizes="64px" /></div>
        <span><span className="pn-title">{next.title}</span></span>
      </a>
    </nav>
  );
}

/* ---------- mises en page ---------- */

function CarouselLayout({ p }) {
  const s = useSlider({ count: p.gallery.length });
  return (
    <>
      <Zoomable
        src={img(p.slug, p.main)}
        sizes="100vw"
        cap={`${p.title} — vue principale`}
        className="rv-img shown"
        style={{ aspectRatio: "16/9" }}
      />
      <div className="p1-carousel slider" role="region" aria-roledescription="carrousel" aria-label="Photographies du projet" {...s.rootProps}>
        <div className="sl-track" style={s.trackStyle}>
          {p.gallery.map((g, i) => (
            <Zoomable key={g} src={img(p.slug, g)} sizes="100vw" cap={`${p.title} — photo ${i + 1}`} {...s.slideProps(i)} />
          ))}
        </div>
      </div>
      <div className="p1-bar">
        <Counter s={s} />
        <Arrows s={s} labels={["Photo précédente", "Photo suivante"]} />
      </div>
    </>
  );
}

function VerticalLayout({ p }) {
  const s = useSlider({ count: p.gallery.length, vertical: true, wheel: true });
  return (
    <div className="p2-layout">
      <div className="p2-slider slider vertical" role="region" aria-roledescription="carrousel vertical" aria-label="Séquence verticale du projet" {...s.rootProps}>
        <div className="sl-track" style={s.trackStyle}>
          {p.gallery.map((g, i) => (
            <Zoomable key={g} src={img(p.slug, g)} sizes="(max-width: 820px) 100vw, 66vw" cap={`${p.title} — vue ${i + 1}`} {...s.slideProps(i)} />
          ))}
        </div>
      </div>
      <div className="p2-side">
        <Counter s={s} />
        <Arrows s={s} vertical />
        <p style={{ fontSize: "12.5px", color: "var(--muted)" }}>Molette, glisser ou flèches</p>
      </div>
    </div>
  );
}

function MosaicLayout({ p }) {
  return (
    <div className="p3-mosaic">
      {p.gallery.slice(0, 3).map((g, i) => (
        <Zoomable key={g} src={img(p.slug, g)} sizes={i === 0 ? "(max-width: 820px) 100vw, 60vw" : "(max-width: 820px) 100vw, 38vw"} cap={`${p.title} — vue ${i + 1}`} className={`p3-m${i + 1}`} />
      ))}
    </div>
  );
}

function CompareLayout({ p }) {
  const [a, b, c] = p.gallery;
  return (
    <>
      <Compare slug={p.slug} before={a} after={b} />
      <div className="p4-row">
        <div className="p4-plan">
          <div className="plan-board">
            <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="10" y="10" width="280" height="280" />
              <line x1="10" y1="103" x2="290" y2="103" />
              <line x1="10" y1="196" x2="290" y2="196" />
              <line x1="103" y1="10" x2="103" y2="290" />
              <line x1="196" y1="10" x2="196" y2="290" />
            </svg>
            <span className="plan-cap">Plan schématique — illustration</span>
          </div>
        </div>
        <Zoomable src={img(p.slug, c)} sizes="(max-width: 820px) 100vw, 50vw" cap={`${p.title} — détail`} className="p4-detail" />
      </div>
      {p.details && (
        <div className="p4-acc-wrap">
          <Accordion title="Détails du projet" rows={p.details} />
        </div>
      )}
    </>
  );
}

function GalleryLayout({ p }) {
  const hgal = useRef(null);
  const [progress, setProgress] = useState(0);
  useDragScroll(hgal);
  useEffect(() => {
    const el = hgal.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  const s = useSlider({ count: p.gallery.length });

  return (
    <>
      <div className="p5-layout">
        <Reveal className="p5-sticky">
          <span className="idx">{p.n}</span>
          <h3 style={{ fontSize: "17px", marginTop: "4px" }}>{p.title}</h3>
          <p style={{ fontSize: "12.5px", color: "var(--sub)", marginTop: "8px" }}>
            {p.kicker}<br />{p.loc}
          </p>
        </Reveal>
        <div className="p5-hwrap">
          <div className="p5-hgal" ref={hgal} tabIndex={0} aria-label="Galerie horizontale, faites glisser pour parcourir">
            {p.gallery.map((g, i) => (
              <Zoomable key={g} src={img(p.slug, g)} sizes="(max-width: 820px) 260px, 380px" cap={`${p.title} — vue ${i + 1}`} className={i === 0 ? "rv-img shown" : ""} />
            ))}
          </div>
          <div className="p5-hprogress"><span style={{ width: `${progress}%` }} /></div>
        </div>
      </div>

      <div className="p5-thumbwrap">
        <div className="p5-main slider" role="region" aria-roledescription="carrousel" aria-label="Photographie principale" {...s.rootProps}>
          <div className="sl-track" style={s.trackStyle}>
            {p.gallery.map((g, i) => (
              <Zoomable key={g} src={img(p.slug, g)} sizes="100vw" cap={`${p.title} — principale ${i + 1}`} {...s.slideProps(i)} />
            ))}
          </div>
        </div>
        <div className="p5-bar">
          <Counter s={s} />
          <Arrows s={s} />
        </div>
        <div className="p5-thumbs" aria-label="Miniatures">
          {p.gallery.map((g, i) => (
            <button key={g} className={`thumb${i === s.index ? " active" : ""}`} aria-label={`Photographie ${i + 1}`} onClick={() => s.goTo(i)}>
              <div className="frame real"><Photo src={img(p.slug, g)} sizes="82px" /></div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function GridLayout({ p }) {
  return (
    <div className="p6-grid">
      {p.gallery.map((g, i) => (
        <Zoomable key={g} src={img(p.slug, g)} sizes="(max-width: 820px) 100vw, 50vw" cap={`${p.title} — vue ${i + 1}`} />
      ))}
    </div>
  );
}

const LAYOUTS = {
  carousel: CarouselLayout,
  vertical: VerticalLayout,
  mosaic: MosaicLayout,
  compare: CompareLayout,
  gallery: GalleryLayout,
  grid: GridLayout,
};

export default function ProjectSection({ p }) {
  const Layout = LAYOUTS[p.layout];
  const index = PROJECTS.findIndex((x) => x.key === p.key);
  return (
    <section className="proj" id={`project-${p.n}`} data-idx={p.n} aria-label={`Projet ${p.n}`}>
      <ProjectHead p={p} />
      <Layout p={p} />
      <ProjectNav index={index} />
    </section>
  );
}
