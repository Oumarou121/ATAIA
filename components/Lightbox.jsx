"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { pad } from "@/hooks/useSlider";

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
  const dragX = useRef(null);

  const open = useCallback((el) => {
    const nodes = Array.from(document.querySelectorAll("[data-zoom]"));
    setItems(nodes.map((n) => ({ bg: n.dataset.bg, cap: n.dataset.cap || "" })));
    setIdx(Math.max(0, nodes.indexOf(el)));
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

  const cur = items[idx];

  return (
    <LightboxCtx.Provider value={{ open }}>
      {children}
      <div
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
            {cur && <div className={`frame real ${cur.bg}`} role="img" aria-label={cur.cap} />}
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
export function Zoomable({ bg, cap, className = "", children, ...rest }) {
  const { open } = useLightbox();
  return (
    <div
      className={`frame real zoomable ${className} ${bg}`.replace(/\s+/g, " ").trim()}
      data-zoom
      data-bg={bg}
      data-cap={cap}
      tabIndex={0}
      role="button"
      aria-label={cap ? `Agrandir : ${cap}` : "Agrandir l'image"}
      onClick={(e) => open(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e.currentTarget); }
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
