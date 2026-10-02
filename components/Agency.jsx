"use client";
import { AGENCY, SITE, img } from "@/lib/data";
import { Zoomable } from "./Lightbox";
import Reveal from "./Reveal";
import OrgChart from "./OrgChart";
import Team from "./Team";

function Fig({ n, className, sizes, aspect }) {
  const p = AGENCY.photos[n];
  return (
    <Reveal as="figure" className={`ag-fig ${className}`}>
      <div className="ag-ph" style={aspect ? { aspectRatio: aspect } : undefined}>
        <Zoomable src={img(p.slug, p.i)} sizes={sizes} cap={p.cap} position={p.pos} />
      </div>
      <figcaption><b>{String(n + 1).padStart(2, "0")}</b> {p.cap}</figcaption>
    </Reveal>
  );
}

export default function Agency() {
  return (
    <section className="agency" id="agency" aria-label="Agence">
      <div className="ag-row">
        <Reveal className="ag-text">
          <h2>{AGENCY.title}</h2>
          <p className="ag-full">{SITE.fullName}</p>
          <p className="ag-doms">{AGENCY.domains}</p>
          <p style={{ fontSize: "14.5px", color: "var(--sub)", lineHeight: 1.65, maxWidth: "42ch" }}>{AGENCY.text}</p>
        </Reveal>
        <Fig n={0} className="ag-a" sizes="(max-width: 900px) 100vw, 40vw" />
      </div>
      <div className="ag-row">
        <Fig n={1} className="ag-b" sizes="(max-width: 900px) 100vw, 88vw" />
      </div>
      <div className="ag-row ag-pair">
        <Fig n={2} className="ag-c" sizes="(max-width: 900px) 100vw, 40vw" />
        <Fig n={3} className="ag-d" sizes="(max-width: 900px) 100vw, 48vw" />
      </div>
      <OrgChart />
      <Team />
    </section>
  );
}
