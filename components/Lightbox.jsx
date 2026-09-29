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
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close, go]);

  useFocusTrap(overlay, isOpen);

  const cur = items[idx];

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
        onPointerDown={(e) => (dragX.current = e.clientX)}
        onPointerUp={(e) => {
          if (dragX.current === null) return;
          const dx = e.clientX - dragX.current;
          if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
          dragX.current = null;
        }}
      >
        <div className="lb-card">
          <button ref={closeBtn} className="lb-close" onClick={close} aria-label="Fermer">Fermer ×</button>
          <div className="lb-media">
            {cur && (
              <div className="frame real" role="img" aria-label={cur.cap}>
                <Photo key={cur.src} src={cur.src} sizes="(max-width: 900px) 100vw, 880px" loading="eager" />
              </div>
            )}
          </div>
          <p className="lb-cap">{cur?.cap}</p>
          <div className="lb-nav">
            <button onClick={() => go(-1)}>← Précédent</button>
            <span className="lb-count">{cur ? `${pad(idx + 1)} / ${pad(items.length)}` : ""}</span>
            <button onClick={() => go(1)}>Suivant →</button>
          </div>
        </div>
      </div>
    </LightboxCtx.Provider>
  );
}

/** Image cliquable qui s'ouvre dans la visionneuse. */
export function Zoomable({ src, cap, group, sizes, loading, className = "", children, ...rest }) {
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
      <Photo src={src} alt={cap || ""} sizes={sizes} loading={loading} />
      {children}
    </div>
  );
}
