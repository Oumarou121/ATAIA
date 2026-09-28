"use client";
import { useEffect } from "react";

/** Défilement horizontal au glisser (souris/stylet) sur un conteneur scrollable. */
export function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false, startX = 0, startLeft = 0, moved = false;

    const onDown = (e) => {
      if (e.pointerType === "touch") return; // le tactile scrolle nativement
      down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.classList.add("dragging");
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const up = () => {
      down = false;
      el.classList.remove("dragging");
      setTimeout(() => (moved = false), 0);
    };
    const onClick = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", up);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", up);
      el.removeEventListener("click", onClick, true);
    };
  }, [ref]);
}
