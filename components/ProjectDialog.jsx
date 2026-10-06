"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import Photo from "./Photo";

const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Fiche d'une réalisation (projet, villa, résidence ou plan) : visionneuse d'images (flèches, vignettes, balayage tactile)
 * et informations disponibles (description, fiche technique, points clés). Se ferme avec Échap ou le bouton. À monter avec `key={id}` pour repartir de la première image à chaque ouverture.
 * `item` : { title, chip, sub, desc, facts: [[label, valeur]], notes: [{ label, note }], images: [{ src, cap }], plan }
 */
export default function ProjectDialog({ item, onClose }) {
  const open = Boolean(item);
  const images = item?.images ?? [];
  const many = images.length > 1;
  const [idx, setIdx] = useState(0);
  const root = useRef(null);
  const closeBtn = useRef(null);
  const thumbs = useRef(null);
  const touch = useRef(null);

  const go = useCallback((d) => setIdx((i) => (images.length ? (i + d + images.length) % images.length : 0)), [images.length]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, go]);

  useFocusTrap(root, open);

  useEffect(() => {
    thumbs.current?.children[idx]?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [idx]);

  if (!open) return null;
  const cur = images[idx];

  function onTouchEnd(e) {
    const s = touch.current;
    touch.current = null;
    if (!s || !many) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
  }

  return (
    <div className="pd" role="dialog" aria-modal="true" aria-labelledby="pd-title" ref={root}>
      <div className="pd-bar">
        <span className="pd-chip">{item.chip}</span>
        <button type="button" className="pd-close" onClick={onClose} ref={closeBtn}>
          Fermer <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className="pd-body">
        <div className="pd-media">
          <div
            className={`pd-stage${item.plan ? " is-plan" : ""}`}
            onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
            onTouchEnd={onTouchEnd}
          >
            <Photo key={cur.src} src={cur.src} alt={cur.cap} sizes="(max-width: 900px) 100vw, 68vw" className="pd-img" />
            {many && (
              <>
                <button type="button" className="pd-arrow prev" onClick={() => go(-1)} aria-label="Image précédente">←</button>
                <button type="button" className="pd-arrow next" onClick={() => go(1)} aria-label="Image suivante">→</button>
                <span className="pd-count" aria-hidden="true">{pad2(idx + 1)} / {pad2(images.length)}</span>
              </>
            )}
          </div>

          {many && (
            <div className="pd-thumbs" ref={thumbs}>
              {images.map((im, i) => (
                <button
                  key={im.src}
                  type="button"
                  className={`pd-th${i === idx ? " on" : ""}`}
                  onClick={() => setIdx(i)}
                  aria-label={`Image ${i + 1} sur ${images.length} : ${im.cap}`}
                  aria-current={i === idx}
                >
                  <Photo src={im.src} sizes="96px" />
                </button>
              ))}
            </div>
          )}
          <p className="pd-cap" aria-live="polite">{cur.cap}</p>
        </div>

        <div className="pd-info">
          <h2 id="pd-title" className="pd-title">{item.title}</h2>
          {item.sub && <p className="pd-sub">{item.sub}</p>}
          {item.desc && <p className="pd-desc">{item.desc}</p>}

          {item.facts?.length > 0 && (
            <dl className="pd-facts">
              {item.facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {item.notes?.length > 0 && (
            <ul className="pd-notes">
              {item.notes.map((n) => (
                <li key={n.label}>
                  <b>{n.label}</b>
                  {n.note}
                </li>
              ))}
            </ul>
          )}

          <a className="pd-open" href={cur.src} target="_blank" rel="noopener noreferrer">
            Ouvrir l&apos;image en grand <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
