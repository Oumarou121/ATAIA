"use client";
import { useEffect } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/** Garde le focus clavier (Tab / Maj+Tab) à l'intérieur de `ref` tant que `active` est vrai. */
export function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const root = ref.current;
      if (!root) return;
      const nodes = Array.from(root.querySelectorAll(FOCUSABLE)).filter(
        (n) => n.getClientRects().length > 0
      );
      if (!nodes.length) { e.preventDefault(); return; }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const cur = document.activeElement;
      const inside = root.contains(cur);
      if (e.shiftKey && (cur === first || !inside)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (cur === last || !inside)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ref, active]);
}
