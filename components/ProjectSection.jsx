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
    <Reveal as="nav" className="proj-nav" aria-label="Navigation entre projets">
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
    </Reveal>
  );
}

/* ---------- mises en page ---------- */

/* ---------- Projet 01 : étude de cas ---------- */

function Fig({ p, i, cls, ratio, sizes }) {
  const v = p.views[i];
  return (
    <figure className={`bc-fig ${cls}`} style={ratio ? { "--r": ratio } : undefined}>
      <Reveal img>
        <Zoomable src={img(p.slug, i)} sizes={sizes} cap={v.cap} position={v.pos}>
          <span className="bc-tag">{v.cap}</span>
        </Zoomable>
      </Reveal>
    </figure>
  );
}

function Chapter({ id, n, c, children }) {
  return (
    <section className="bc-ch" id={id} aria-labelledby={`${id}-t`}>
      <Reveal className="bc-ch-head">
        <span className="n">{pad(n)}</span>
        <h3 id={`${id}-t`}>{c.label}</h3>
        <p>{c.note}</p>
      </Reveal>
      {children}
    </section>
  );
}

function FeatureLayout({ p }) {
  const [c1, c2, c3] = p.chapters;
  const cmp = p.compare;
  const half = "(max-width: 820px) 100vw, 50vw";
  return (
    <>
      <div className="bc-head">
        <Reveal className="bc-head-main">
          <p className="bc-kicker"><span className="bc-idx">{p.n}</span><span>{p.kicker}</span></p>
          <h2 className="bc-title">{p.title}</h2>
        </Reveal>
        <Reveal className="bc-head-side d1">
          <p className="bc-desc">{p.desc}</p>
          <ol className="bc-toc" aria-label="Chapitres du projet">
            {p.chapters.map((c, i) => (
              <li key={c.label}>
                <a href={`#bc-${i + 1}`}><span className="n">{pad(i + 1)}</span>{c.label}<span className="arr" aria-hidden="true">↓</span></a>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal as="dl" className="bc-facts d2">
          {p.facts.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </Reveal>
      </div>

      <Chapter id="bc-1" n={1} c={c1}>
        <Reveal img className="bc-stage">
          <Compare
            slug={p.slug}
            before={cmp.before}
            after={cmp.after}
            labels={cmp.labels}
            icons={cmp.icons}
            alts={cmp.alts}
            ratio={cmp.ratio}
            title={p.title}
          />
        </Reveal>
        <div className="bc-grid bc-duo">
          <Fig p={p} i={2} cls="bc-a" ratio="16/10" sizes={half} />
          <Fig p={p} i={7} cls="bc-b" ratio="16/10" sizes={half} />
        </div>
      </Chapter>

      <Chapter id="bc-2" n={2} c={c2}>
        <div className="bc-grid bc-site">
          <Fig p={p} i={0} cls="bc-a" ratio="1435/1096" sizes="(max-width: 820px) 100vw, 60vw" />
          <Fig p={p} i={3} cls="bc-b" sizes="(max-width: 820px) 100vw, 40vw" />
          <Fig p={p} i={4} cls="bc-c" sizes="(max-width: 820px) 100vw, 40vw" />
        </div>
      </Chapter>

      <Chapter id="bc-3" n={3} c={c3}>
        <div className="bc-grid bc-checker">
          <Fig p={p} i={5} cls="bc-a" ratio="3/2" sizes="(max-width: 820px) 100vw, 42vw" />
          <Fig p={p} i={10} cls="bc-b" ratio="16/10" sizes="(max-width: 820px) 100vw, 58vw" />
          <Fig p={p} i={8} cls="bc-c" ratio="16/10" sizes="(max-width: 820px) 100vw, 58vw" />
          <Fig p={p} i={9} cls="bc-d" ratio="3/2" sizes="(max-width: 820px) 100vw, 42vw" />
        </div>
      </Chapter>
    </>
  );
}


function CarouselLayout({ p }) {
  const s = useSlider({ count: p.gallery.length });
  return (
    <>
      {p.showMain !== false && (
        <Reveal img>
        <Zoomable
          src={img(p.slug, p.main)}
          sizes="100vw"
          cap={`${p.title} — vue principale`}
          style={{ aspectRatio: "16/9" }}
        />
        </Reveal>
      )}
      <Reveal img>
      <div className="p1-carousel slider" role="region" aria-roledescription="carrousel" aria-label="Photographies du projet" {...s.rootProps}>
        <div className="sl-track" style={s.trackStyle}>
          {p.gallery.map((g, i) => (
            <Zoomable key={g} src={img(p.slug, g)} sizes="100vw" cap={`${p.title} — photo ${i + 1}`} position={p.focus?.[i]} {...s.slideProps(i)} />
          ))}
        </div>
      </div>
      </Reveal>
      <Reveal className="p1-bar">
        <Counter s={s} />
        <Arrows s={s} labels={["Photo précédente", "Photo suivante"]} />
      </Reveal>
      {p.details && (
        <Reveal className="p4-acc-wrap">
          <Accordion title="Détails du projet" rows={p.details} />
        </Reveal>
      )}
    </>
  );
}

function ChaptersLayout({ p }) {
  return (
    <>
      <div className="p2-top">
        <Reveal className="meta">
          <span className="idx">{p.n}</span>
          <h2>{p.title}</h2>
          <p className="loc"><span>{p.kicker}</span><span>{p.loc}</span></p>
          <p className="desc">{p.desc}</p>
        </Reveal>
        {p.details && (
          <Reveal as="dl" className="p2-facts">
            {p.details.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </Reveal>
        )}
      </div>

      {p.chapters.map((c, ci) => (
        <div key={c.label} className={`p2-ch p2-ch-${ci + 1}`}>
          <Reveal className="p2-ch-head">
            <span className="n">{pad(ci + 1)}</span>
            <h3>{c.label}</h3>
            <p>{c.note}</p>
          </Reveal>
          {c.views.map((v) => (
            <figure key={v.i} className="p2-fig">
              <Reveal img className={v.wide ? "p2-wide" : undefined}>
                <Zoomable
                  src={img(p.slug, v.i)}
                  sizes={c.views.length === 1 ? "(max-width: 820px) 100vw, 1240px" : "(max-width: 820px) 100vw, 50vw"}
                  cap={v.alt}
                  position={v.pos}
                />
              </Reveal>
            </figure>
          ))}
        </div>
      ))}

      <Reveal>
        <a className="p2-more" href="#villas-residences">Voir les villas de la cité <span aria-hidden="true">→</span></a>
      </Reveal>
    </>
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
  const [a, b, ...rest] = p.gallery;
  return (
    <div className="cmp-layout">
      <Reveal className="cmp-meta">
        <div className="meta">
          <span className="idx">{p.n}</span>
          <h2>{p.title}</h2>
          <p className="loc"><span>{p.kicker}</span><span>{p.loc}</span></p>
          <p className="desc">{p.desc}</p>
        </div>
        {p.details && (
          <div className="cmp-details">
            <Accordion title="Détails du projet" rows={p.details} />
          </div>
        )}
      </Reveal>
      <div className="cmp-main">
        <Reveal img>
        <Compare
          slug={p.slug}
          before={a}
          after={b}
          labels={p.compareLabels}
          icons={p.compareIcons}
          alts={p.compareAlts}
          align={p.compareAlign}
          ratio={p.compareRatio}
          position={p.compareFocus}
          title={p.title}
        />
        </Reveal>
        {rest.length > 0 && (
          <Reveal className="cmp-more" stagger>
            {rest.map((g, i) => {
              const v = p.compareViews?.[i];
              return (
                <figure key={g} className="cmp-fig">
                  <Zoomable src={img(p.slug, g)} sizes="(max-width: 900px) 100vw, 440px" cap={v?.alt || `${p.title} — vue ${i + 3}`} />
                  {v?.cap && <figcaption>{v.cap}</figcaption>}
                </figure>
              );
            })}
          </Reveal>
        )}
      </div>
    </div>
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
        <Reveal className="p5-hwrap d1">
          <div className="p5-hgal" ref={hgal} tabIndex={0} aria-label="Galerie horizontale, faites glisser pour parcourir">
            {p.gallery.map((g, i) => (
              <Zoomable key={g} src={img(p.slug, g)} sizes="(max-width: 820px) 260px, 380px" cap={`${p.title} — vue ${i + 1}`} className={i === 0 ? "rv-img shown" : ""} />
            ))}
          </div>
          <div className="p5-hprogress"><span style={{ width: `${progress}%` }} /></div>
        </Reveal>
      </div>

      <Reveal className="p5-thumbwrap">
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
      </Reveal>
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
  feature: FeatureLayout,
  carousel: CarouselLayout,
  chapters: ChaptersLayout,
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
      {p.layout !== "compare" && p.layout !== "chapters" && p.layout !== "feature" && <ProjectHead p={p} />}
      <Layout p={p} />
      <ProjectNav index={index} />
    </section>
  );
}
