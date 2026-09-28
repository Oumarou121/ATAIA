"use client";
import { useState } from "react";
import { PROJECTS, bg } from "@/lib/data";
import Reveal from "./Reveal";

export default function ProjectIndex() {
  const [active, setActive] = useState(null);
  const [hovering, setHovering] = useState(false);

  const enter = (key) => { setHovering(true); setActive(key); };

  return (
    <section className="pindex" id="projects" aria-label="Index des projets">
      <Reveal as="p" className="pindex-head">Projets</Reveal>
      <div className={`pindex-grid${hovering ? " hovering" : ""}`} onMouseLeave={() => setHovering(false)}>
        <ol>
          {PROJECTS.map((p) => (
            <li key={p.key}>
              <a
                className={`prow${active === p.key ? " active" : ""}`}
                href={`#project-${p.n}`}
                onMouseEnter={() => enter(p.key)}
                onFocus={() => enter(p.key)}
              >
                <span className="n">{p.n}</span>
                <span className="t">{p.title}</span>
                <span className="k">{p.domain}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="pprev" aria-hidden="true">
          {PROJECTS.map((p) => (
            <div key={p.key} className={`frame real pv ${active === p.key ? "active " : ""}${bg(p.slug, p.main)}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
