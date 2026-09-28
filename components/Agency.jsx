"use client";
import { AGENCY, bg } from "@/lib/data";
import { pad, useSlider } from "@/hooks/useSlider";
import { Zoomable } from "./Lightbox";
import Reveal from "./Reveal";
import OrgChart from "./OrgChart";

export default function Agency() {
  const s = useSlider({ count: AGENCY.slides.length, auto: 5200 });
  return (
    <section className="agency" id="agency" aria-label="Agence">
      <div className="ag-row">
        <Reveal className="ag-text">
          <h2>{AGENCY.title}</h2>
          <p className="ag-doms">{AGENCY.domains}</p>
          <p style={{ fontSize: "14.5px", color: "var(--sub)", lineHeight: 1.65, maxWidth: "42ch" }}>{AGENCY.text}</p>
        </Reveal>
        <Reveal className="ag-carousel slider" role="region" aria-roledescription="carrousel" aria-label="Photographies de l'agence" {...s.rootProps}>
          <div className="sl-track" style={s.trackStyle}>
            {AGENCY.slides.map((sl) => (
              <Zoomable key={sl.slug + sl.i} bg={bg(sl.slug, sl.i)} cap={sl.cap} />
            ))}
          </div>
        </Reveal>
      </div>
      <div className="ag-row" style={{ marginTop: "12px" }}>
        <div />
        <div className="ag-bar" style={{ gridColumn: "8/span 5" }}>
          <span className="sl-counter">{pad(s.index + 1)} / {pad(s.count)}</span>
          <div className="sl-arrows">
            <button className="sl-btn" onClick={s.prev} aria-label="Image précédente">←</button>
            <button className="sl-btn" onClick={s.next} aria-label="Image suivante">→</button>
          </div>
        </div>
      </div>
      <OrgChart />
    </section>
  );
}
