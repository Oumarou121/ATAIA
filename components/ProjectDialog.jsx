"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import Photo from "./Photo";

const pad2 = (n) => String(n).padStart(2, "0");
const MIN_Z = 1;
const MAX_Z = 5;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

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
  const stage = useRef(null);
  // Zoom / déplacement : scale >= 1, (x, y) = décalage en px depuis le centre
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const viewRef = useRef(view);
  viewRef.current = view;
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const moved = useRef(false);

  const go = useCallback((d) => setIdx((i) => (images.length ? (i + d + images.length) % images.length : 0)), [images.length]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useFocusTrap(root, open);

  // Recadre le décalage pour que l'image ne sorte jamais entièrement du cadre
  const applyView = useCallback((s, x, y) => {
    const r = stage.current?.getBoundingClientRect();
    s = clamp(s, MIN_Z, MAX_Z);
    if (!r || s === 1) return setView({ s, x: 0, y: 0 });
    const mx = ((s - 1) * r.width) / 2;
    const my = ((s - 1) * r.height) / 2;
    setView({ s, x: clamp(x, -mx, mx), y: clamp(y, -my, my) });
  }, []);

  // Zoome en gardant fixe le point (px, py) sous le curseur / les doigts
  const zoomAt = useCallback((ns, px, py) => {
    const r = stage.current?.getBoundingClientRect();
    const { s, x, y } = viewRef.current;
    ns = clamp(ns, MIN_Z, MAX_Z);
    if (!r) return applyView(ns, x, y);
    const cx = px - (r.left + r.width / 2);
    const cy = py - (r.top + r.height / 2);
    const k = ns / s;
    applyView(ns, cx - (cx - x) * k, cy - (cy - y) * k);
  }, [applyView]);

  const zoomBy = useCallback((factor) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    zoomAt(viewRef.current.s * factor, r.left + r.width / 2, r.top + r.height / 2);
  }, [zoomAt]);

  const resetZoom = useCallback(() => setView({ s: 1, x: 0, y: 0 }), []);

  // Repart d'une vue entière à chaque changement d'image
  useEffect(() => { setView({ s: 1, x: 0, y: 0 }); }, [idx]);

  // Molette : listener non passif pour empêcher le défilement de la page
  useEffect(() => {
    const el = stage.current;
    if (!open || !el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const f = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0022));
      zoomAt(viewRef.current.s * f, e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open, zoomAt]);

  const onPointerDown = (e) => {
    if (e.target.closest("button")) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = false;
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      gesture.current = { type: "pinch", d: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) };
    } else {
      gesture.current = { type: "drag", sx: e.clientX, sy: e.clientY, ox: viewRef.current.x, oy: viewRef.current.y };
    }
  };

  const onPointerMove = (e) => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    p.x = e.clientX;
    p.y = e.clientY;
    const g = gesture.current;
    if (!g) return;
    const { s } = viewRef.current;
    if (g.type === "pinch" && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (g.d > 0) zoomAt(s * (d / g.d), (a.x + b.x) / 2, (a.y + b.y) / 2);
      g.d = d;
      moved.current = true;
    } else if (g.type === "drag" && s > 1) {
      const dx = e.clientX - g.sx;
      const dy = e.clientY - g.sy;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
      applyView(s, g.ox + dx, g.oy + dy);
    }
  };

  const onPointerUp = (e) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    // glissement horizontal = image suivante / précédente, uniquement si non zoomée
    if (g?.type === "drag" && viewRef.current.s === 1 && many) {
      const dx = e.clientX - g.sx;
      const dy = e.clientY - g.sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
    }
    if (pointers.current.size === 1) {
      const [rest] = [...pointers.current.values()];
      gesture.current = { type: "drag", sx: rest.x, sy: rest.y, ox: viewRef.current.x, oy: viewRef.current.y };
    } else {
      gesture.current = null;
    }
  };

  const onDoubleClick = (e) => {
    if (e.target.closest("button")) return;
    if (viewRef.current.s > 1) resetZoom();
    else zoomAt(2.5, e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomBy(1.4); }
      else if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomBy(1 / 1.4); }
      else if (e.key === "0") { e.preventDefault(); resetZoom(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, go, zoomBy, resetZoom]);

  useEffect(() => {
    thumbs.current?.children[idx]?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [idx]);

  if (!open) return null;
  const cur = images[idx];

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
            ref={stage}
            className={`pd-stage${item.plan ? " is-plan" : ""}${view.s > 1 ? " is-zoomed" : ""}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={onDoubleClick}
          >
            <div
              className="pd-zoom"
              style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}
            >
              <Photo key={cur.src} src={cur.src} alt={cur.cap} sizes="(max-width: 900px) 200vw, 136vw" className="pd-img" />
            </div>
            <div className="pd-zoomctl" role="group" aria-label="Zoom">
              <button type="button" onClick={() => zoomBy(1 / 1.4)} disabled={view.s <= MIN_Z} aria-label="Dézoomer">−</button>
              <button type="button" className="pd-zv" onClick={resetZoom} disabled={view.s === 1} aria-label="Réinitialiser le zoom">{Math.round(view.s * 100)}%</button>
              <button type="button" onClick={() => zoomBy(1.4)} disabled={view.s >= MAX_Z} aria-label="Zoomer">+</button>
            </div>
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