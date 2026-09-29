"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { img } from "@/lib/data";
import Photo from "./Photo";
import { useLightbox } from "./Lightbox";

const clamp = (v) => Math.max(0, Math.min(100, v));
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const Sun = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
);
const ICONS = { sun: Sun, moon: Moon };

/**
 * Comparateur à curseur : deux vues d'un même projet.
 * - `align` : [null | {scale,x,y}, null | {scale,x,y}] recale chaque vue (scale + décalage en % du cadre)
 *   pour que le bâtiment se superpose quand les deux rendus n'ont pas exactement la même caméra.
 * - `alts` : textes alternatifs des deux vues.
 * - `icons` : ["sun", "moon"] pour illustrer les libellés.
 */
export default function Compare({
  slug,
  before = 0,
  after = 1,
  labels = ["Vue 1", "Vue 2"],
  icons = [],
  alts = ["", ""],
  align = [],
  ratio,
  position,
  title = "",
}) {
  const [pct, setPct] = useState(50);
  const [hint, setHint] = useState(false);
  const root = useRef(null);
  const down = useRef(false);
  const raf = useRef(0);
  const cur = useRef(50);
  const touched = useRef(false);
  const { open } = useLightbox();

  const reduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const set = useCallback((v) => {
    cur.current = clamp(v);
    setPct(cur.current);
  }, []);

  const stop = useCallback(() => cancelAnimationFrame(raf.current), []);

  /** Glisse en douceur jusqu'à `target` (%). Saut direct si mouvement réduit. */
  const animateTo = useCallback(
    (target, ms = 650, onDone) => {
      stop();
      if (reduced() || ms <= 0) { set(target); onDone?.(); return; }
      const from = cur.current;
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms);
        set(from + (target - from) * ease(k));
        if (k < 1) raf.current = requestAnimationFrame(step);
        else onDone?.();
      };
      raf.current = requestAnimationFrame(step);
    },
    [set, stop]
  );

  const fromX = (x) => {
    const r = root.current.getBoundingClientRect();
    return clamp(((x - r.left) / r.width) * 100);
  };

  const interact = () => { touched.current = true; setHint(false); stop(); };

  // Invitation : une seule fois, à l'entrée dans l'écran (35 % → 65 % → 50 %).
  useEffect(() => {
    const el = root.current;
    if (!el || reduced() || !("IntersectionObserver" in window)) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (touched.current) return;
        setHint(true);
        const seq = [[35, 700], [65, 900], [50, 700]];
        const run = (i) => {
          if (cancelled || touched.current) return;
          if (i >= seq.length) { setHint(false); return; }
          animateTo(seq[i][0], seq[i][1], () => run(i + 1));
        };
        setTimeout(() => run(0), 500);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); stop(); };
  }, [animateTo, stop]);

  const fullscreen = (e) => {
    open(e.currentTarget, [
      { src: img(slug, before), cap: alts[0] || `${title} — ${labels[0]}` },
      { src: img(slug, after), cap: alts[1] || `${title} — ${labels[1]}` },
    ]);
  };

  const leftShown = pct > 50; // côté « avant » majoritaire
  const style = (a) =>
    a ? { transformOrigin: "0 0", transform: `translate(${a.x}%, ${a.y}%) scale(${a.scale})` } : undefined;
  const Icon0 = ICONS[icons[0]];
  const Icon1 = ICONS[icons[1]];

  return (
    <div className="cmp-wrap">
      <div
        ref={root}
        className={`compare${hint ? " is-hinting" : ""}`}
        style={ratio ? { aspectRatio: ratio } : undefined}
        role="group"
        aria-label="Comparateur de deux vues du projet"
        onPointerMove={(e) => down.current && set(fromX(e.clientX))}
        onPointerUp={() => (down.current = false)}
        onPointerLeave={() => (down.current = false)}
        onClick={(e) => {
          if (e.target.closest(".cmp-handle")) return;
          interact();
          animateTo(fromX(e.clientX), 350);
        }}
      >
        <div className="frame real cmp-before">
          <Photo src={img(slug, before)} alt={alts[0]} sizes="(max-width: 900px) 100vw, 900px" position={position} style={style(align[0])} />
        </div>
        <div className="frame real cmp-after" style={{ clipPath: `inset(0 0 0 ${pct}%)` }}>
          <Photo src={img(slug, after)} alt={alts[1]} sizes="(max-width: 900px) 130vw, 1200px" position={position} style={style(align[1])} />
        </div>

        <span className={`cmp-label cmp-l${leftShown ? " on" : ""}${pct < 12 ? " gone" : ""}`}>
          {Icon0 && <Icon0 />}{labels[0]}
        </span>
        <span className={`cmp-label cmp-r${!leftShown ? " on" : ""}${pct > 88 ? " gone" : ""}`}>
          {Icon1 && <Icon1 />}{labels[1]}
        </span>

        <div
          className="cmp-handle"
          style={{ left: `${pct}%` }}
          role="slider"
          tabIndex={0}
          aria-label="Position du comparateur"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-valuetext={`${labels[0]} ${Math.round(pct)} %, ${labels[1]} ${Math.round(100 - pct)} %`}
          onPointerDown={(e) => { interact(); down.current = true; e.currentTarget.setPointerCapture?.(e.pointerId); }}
          onKeyDown={(e) => {
            const move = (v) => { e.preventDefault(); interact(); set(v); };
            if (e.key === "ArrowLeft") move(cur.current - 5);
            else if (e.key === "ArrowRight") move(cur.current + 5);
            else if (e.key === "Home") move(0);
            else if (e.key === "End") move(100);
          }}
        >
          <span className="cmp-grip" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>

      <div className="cmp-bar">
        <div className="cmp-toggle" role="group" aria-label="Afficher une vue">
          <button type="button" aria-pressed={pct >= 99} onClick={() => { interact(); animateTo(100); }}>
            {Icon0 && <Icon0 />}{labels[0]}
          </button>
          <button type="button" aria-pressed={pct <= 1} onClick={() => { interact(); animateTo(0); }}>
            {Icon1 && <Icon1 />}{labels[1]}
          </button>
        </div>
        <button type="button" className="cmp-fs" onClick={fullscreen} aria-label="Ouvrir les deux vues en plein écran">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
          Plein écran
        </button>
      </div>
    </div>
  );
}
