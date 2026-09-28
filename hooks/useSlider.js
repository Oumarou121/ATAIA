"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Slider générique (horizontal / vertical) : glisser, clavier, molette, autoplay.
 * Les contrôles (flèches, compteur, miniatures) vivent hors du slider : on les
 * branche simplement sur { index, next, prev, goTo }.
 */
export function useSlider({
  count,
  vertical = false,
  auto = 0,
  playing = true,
  wheel = false,
}) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0); // décalage en % pendant le glisser
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef(null);
  const st = useRef({ start: 0, dim: 0, active: false, moved: false, id: null });

  const goTo = useCallback(
    (i) => setIndex((((i % count) + count) % count)),
    [count]
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Autoplay (respecte prefers-reduced-motion)
  useEffect(() => {
    if (!auto || !playing || paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(next, auto);
    return () => clearInterval(t);
  }, [auto, playing, paused, count, next]);

  // Molette (listener non passif pour pouvoir preventDefault)
  useEffect(() => {
    const el = rootRef.current;
    if (!wheel || !el) return;
    let lock = false;
    const onWheel = (e) => {
      const dv = vertical ? e.deltaY : e.deltaX || e.deltaY;
      if (Math.abs(dv) < 10) return;
      e.preventDefault();
      if (lock) return;
      lock = true;
      dv > 0 ? next() : prev();
      setTimeout(() => (lock = false), 420);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [wheel, vertical, next, prev]);

  const onPointerDown = (e) => {
    const el = rootRef.current;
    if (!el) return;
    st.current = {
      start: vertical ? e.clientY : e.clientX,
      dim: vertical ? el.clientHeight : el.clientWidth,
      active: true,
      moved: false,
      id: e.pointerId,
    };
  };
  const onPointerMove = (e) => {
    const s = st.current;
    if (!s.active) return;
    const delta = (vertical ? e.clientY : e.clientX) - s.start;
    if (!s.moved && Math.abs(delta) > 6) {
      s.moved = true;
      setDragging(true);
      try { rootRef.current.setPointerCapture(s.id); } catch (_) {}
    }
    if (s.moved && s.dim) setDrag((delta / s.dim) * 100);
  };
  const endDrag = () => {
    const s = st.current;
    if (!s.active) return;
    s.active = false;
    if (s.moved) {
      setDragging(false);
      setDrag((d) => {
        if (Math.abs(d) > 14) (d < 0 ? next : prev)();
        return 0;
      });
      // évite qu'un clic soit déclenché juste après un glisser
      setTimeout(() => (s.moved = false), 0);
    }
  };
  const onClickCapture = (e) => {
    if (st.current.moved) { e.preventDefault(); e.stopPropagation(); }
  };
  const onKeyDown = (e) => {
    const [a, b] = vertical ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
    if (e.key === a) { e.preventDefault(); prev(); }
    else if (e.key === b) { e.preventDefault(); next(); }
  };

  const trackStyle = {
    transition: dragging ? "none" : undefined,
    transform: vertical
      ? `translateY(${-index * 100 + drag}%)`
      : `translateX(${-index * 100 + drag}%)`,
  };

  const rootProps = {
    ref: rootRef,
    tabIndex: 0,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onPointerLeave: () => { endDrag(); setPaused(false); },
    onPointerEnter: () => setPaused(true),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
    onKeyDown,
    onClickCapture,
  };

  return { index, count, goTo, next, prev, rootProps, trackStyle };
}

export const pad = (n) => (n < 10 ? "0" + n : "" + n);
