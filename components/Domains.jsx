"use client";
import { useRef, useState } from "react";
import { DOMAINS, bg } from "@/lib/data";

export default function Domains() {
  const [active, setActive] = useState(0);
  const btns = useRef([]);
  const go = (i) => {
    const n = (i + DOMAINS.length) % DOMAINS.length;
    setActive(n);
    btns.current[n]?.focus();
  };

  return (
    <section className="domains" id="domains" aria-label="Domaines d'intervention">
      <div className="dom-row">
        <ul className="dom-list" role="tablist" aria-orientation="vertical" aria-label="Domaines">
          {DOMAINS.map((d, i) => (
            <li key={d.title}>
              <button
                ref={(el) => (btns.current[i] = el)}
                className={`dom-btn${active === i ? " active" : ""}`}
                role="tab"
                aria-selected={active === i}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); go(i + 1); }
                  else if (e.key === "ArrowUp") { e.preventDefault(); go(i - 1); }
                }}
              >
                <span className="dt">{d.title}</span>
                <span className="dd">{d.desc}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="dom-frames" aria-hidden="true">
          {DOMAINS.map((d, i) => (
            <div key={d.title} className={`frame real dom-frame ${active === i ? "active " : ""}${bg(d.slug, d.i)}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
