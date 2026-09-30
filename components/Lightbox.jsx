"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { pad } from "@/hooks/useSlider";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import Photo from "./Photo";

const LightboxCtx = createContext({ open: () => {} });
export const useLightbox = () => useContext(LightboxCtx);

/**
 * Fournit une visionneuse globale : toute image marquée <Zoomable> s'y ouvre,
 * et la navigation parcourt toutes les images de la page dans l'ordre du DOM.
 */
export function LightboxProvider({ children }) {
  const [items, setItems] = useState([]);
  const [idx, setIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const trigger = useRef(null);
  const closeBtn = useRef(null);
  const overlay = useRef(null);
  const dragX = useRef(null);

  // `group` : liste explicite d'images (ex. les photos d'une villa). Sinon on
  // parcourt les images visibles de la page, sans les doublons ni celles
  // d'un onglet masqué.
  const open = useCallback((el, group) => {
    let list;
    let start = 0;
    if (group?.length) {
      list = group;
    } else {
      const seen = new Set();
      list = [];
      document.querySelectorAll("[data-zoom]").forEach((n) => {
        if (n.closest("[hidden]") || seen.has(n.dataset.src)) return;
        seen.add(n.dataset.src);
        list.push({ src: n.dataset.src, cap: n.dataset.cap || "" });
      });
      start = Math.max(0, list.findIndex((it) => it.src === el.dataset.src));
    }
    setItems(list);
    setIdx(start);
    trigger.current = el;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    trigger.current?.focus?.();
  }, []);
  const go = useCallback(
    (d) => setIdx((i) => (items.length ? (i + d + items.length) % items.length : 0)),
    [items.length]
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) closeBtn.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "Home") { e.preventDefault(); setIdx(0); }
      else if (e.key === "End") { e.preventDefault(); setIdx(items.length - 1); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close, go, items.length]);

  useFocusTrap(overlay, isOpen);

  const cur = items[idx];
  const many = items.length > 1;
  const at = (d) => items[(idx + d + items.length) % items.length];

  return (
    <LightboxCtx.Provider value={{ open }}>
      {children}
      <div
        ref={overlay}
        inert={!isOpen}
        className={`lightbox${isOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Visionneuse d'image"
        aria-hidden={!isOpen}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <div className="lb-top" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <p className="lb-count" aria-live="polite">
            {cur ? (<><b>{pad(idx + 1)}</b> / {pad(items.length)}</>) : null}
          </p>
          <button ref={closeBtn} className="lb-close" onClick={close} aria-label="Fermer la visionneuse">
            <span>Fermer</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="lb-body">
          {many && (
            <button className="lb-arrow lb-arrow-side" onClick={() => go(-1)} aria-label="Image précédente">
              <Arrow dir="left" />
            </button>
          )}
          <div
            className="lb-stage"
            onPointerDown={(e) => (dragX.current = e.clientX)}
            onPointerUp={(e) => {
              if (dragX.current === null) return;
              const dx = e.clientX - dragX.current;
              if (many && Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
              dragX.current = null;
            }}
            onPointerCancel={() => (dragX.current = null)}
          >
            {cur && <LbImage key={cur.src} src={cur.src} cap={cur.cap} />}
          </div>
          {many && (
            <button className="lb-arrow lb-arrow-side" onClick={() => go(1)} aria-label="Image suivante">
              <Arrow dir="right" />
            </button>
          )}
        </div>

        <div className="lb-bottom" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          {many && (
            <button className="lb-arrow lb-arrow-foot" onClick={() => go(-1)} aria-label="Image précédente">
              <Arrow dir="left" />
            </button>
          )}
          <p className="lb-cap" aria-live="polite">{cur?.cap}</p>
          {many && (
            <button className="lb-arrow lb-arrow-foot" onClick={() => go(1)} aria-label="Image suivante">
              <Arrow dir="right" />
            </button>
          )}
        </div>

        {/* précharge les voisines pour que le passage à l'image suivante soit immédiat */}
        {isOpen && many && (
          <div className="lb-pre" aria-hidden="true">
            {[at(-1), at(1)].map((it) => (
              <Photo key={it.src} src={it.src} sizes="100vw" loading="eager" />
            ))}
          </div>
        )}
      </div>
    </LightboxCtx.Provider>
  );
}

function Arrow({ dir }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

/** Image entière (object-fit: contain), qui n'apparaît qu'une fois chargée. */
function LbImage({ src, cap }) {
  const [ready, setReady] = useState(false);
  const done = () => setReady(true);
  return (
    <div className={`lb-fig${ready ? " ready" : ""}`}>
      <Photo src={src} alt={cap || ""} sizes="100vw" loading="eager" onLoad={done} onError={done} />
    </div>
  );
}

/** Image cliquable qui s'ouvre dans la visionneuse. */
export function Zoomable({ src, cap, group, sizes, loading, position, className = "", children, ...rest }) {
  const { open } = useLightbox();
  return (
    <div
      className={`frame real zoomable ${className}`.replace(/\s+/g, " ").trim()}
      data-zoom={group ? undefined : "true"}
      data-src={src}
      data-cap={cap}
      tabIndex={0}
      role="button"
      aria-label={cap ? `Agrandir : ${cap}` : "Agrandir l'image"}
      onClick={(e) => open(e.currentTarget, group)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e.currentTarget, group); }
      }}
      {...rest}
    >
      <Photo src={src} alt={cap || ""} sizes={sizes} loading={loading} position={position} />
      {children}
    </div>
  );
}
