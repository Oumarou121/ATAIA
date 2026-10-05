"use client";
import { useId, useRef, useState } from "react";
import { PRESENTATION } from "@/lib/data";
import Reveal from "./Reveal";
import OrgChart, { OrgNotes } from "./OrgChart";

const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Présentation de l'agence juste après le hero : une seule carte visible à la fois.
 * Navigation : onglets (flèches gauche/droite au clavier), boutons précédent/suivant, balayage tactile.
 * Sur grand écran, chaque carte se lit en deux colonnes (titre et texte à gauche, contenu à droite).
 * Données : PRESENTATION dans lib/data.js.
 */
export default function Presentation() {
  const cards = PRESENTATION.cards;
  const uid = useId();
  const tabs = useRef(null);
  const touch = useRef(null);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);

  function go(n, focus = false) {
    const t = Math.max(0, Math.min(cards.length - 1, n));
    if (t === i) return;
    setDir(t > i ? 1 : -1);
    setI(t);
    if (focus) tabs.current?.children[t]?.focus();
  }

  function onTabKey(e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1, true); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, true); }
    else if (e.key === "Home") { e.preventDefault(); go(0, true); }
    else if (e.key === "End") { e.preventDefault(); go(cards.length - 1, true); }
  }

  function onTouchEnd(e) {
    const s = touch.current;
    touch.current = null;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) go(i + (dx < 0 ? 1 : -1));
  }

  return (
    <section className="pres" id="presentation" aria-label="Présentation de l'agence">
      <Reveal className="pres-head">
        <div>
          <span className="idx">+</span>
          <h2 className="pres-title">{PRESENTATION.title}</h2>
        </div>
        <div className="pres-nav">
          <span className="pres-count" aria-hidden="true">
            {pad2(i + 1)} / {pad2(cards.length)}
          </span>
          <button type="button" className="pres-btn" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Carte précédente">
            ←
          </button>
          <button type="button" className="pres-btn" onClick={() => go(i + 1)} disabled={i === cards.length - 1} aria-label="Carte suivante">
            →
          </button>
        </div>
      </Reveal>

      <div className="pres-tabs" role="tablist" aria-label="Sections de la présentation" ref={tabs} onKeyDown={onTabKey}>
        {cards.map((c, n) => (
          <button
            key={c.tab}
            type="button"
            role="tab"
            id={`${uid}-t${n}`}
            aria-controls={`${uid}-p${n}`}
            aria-selected={n === i}
            tabIndex={n === i ? 0 : -1}
            className={`pres-tab${n === i ? " on" : ""}`}
            onClick={() => go(n)}
          >
            <b>{pad2(n + 1)}</b>
            <span>{c.tab}</span>
          </button>
        ))}
      </div>

      <div
        className="pres-stage"
        data-dir={dir}
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={onTouchEnd}
      >
        {cards.map((c, n) => (
          <article
            key={c.tab}
            role="tabpanel"
            id={`${uid}-p${n}`}
            aria-labelledby={`${uid}-t${n}`}
            hidden={n !== i}
            className={`pres-card${c.kind === "org" ? " is-org" : ""}`}
          >
            <div className="pres-grid">
              <div className="pres-side">
                <span className="pres-no">
                  <b>{pad2(n + 1)}</b> {c.kicker}
                </span>
                <h3 className="pres-ct">{c.title}</h3>
                {c.lead && <p className="pres-lead">{c.lead}</p>}
                {c.kind === "org" && <OrgNotes />}
              </div>

              <div className="pres-main">
                {c.kind === "org" ? (
                  <OrgChart />
                ) : (
                  <div className="pres-secs" style={{ "--cols": c.cols ?? 2 }}>
                    {c.sections.map((sec) => (
                      <section key={sec.title} className={`pres-sec${sec.wide ? " wide" : ""}`}>
                        <h4 className="pres-sh">{sec.title}</h4>
                        {sec.text && <p className="pres-st">{sec.text}</p>}
                        {sec.pills && (
                          <ul className="pres-pills">
                            {sec.pills.map((p) => (
                              <li key={p}>{p}</li>
                            ))}
                          </ul>
                        )}
                        {sec.items && (
                          <ul className="pres-list">
                            {sec.items.map((it) => (
                              <li key={it}>{it}</li>
                            ))}
                          </ul>
                        )}
                      </section>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
