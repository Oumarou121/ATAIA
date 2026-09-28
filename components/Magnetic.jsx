"use client";
import { useRef } from "react";

/** Bouton "magnétique" : suit très légèrement le curseur (souris uniquement). */
export default function Magnetic({ className = "", children, ...rest }) {
  const ref = useRef(null);
  const fine = () =>
    window.matchMedia("(hover:hover) and (pointer:fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <button
      ref={ref}
      className={`${className} magnetic`}
      onMouseMove={(e) => {
        if (!fine()) return;
        const r = ref.current.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        ref.current.style.transform = `translate(${mx * 0.28}px,${my * 0.28}px)`;
      }}
      onMouseLeave={() => { if (ref.current) ref.current.style.transform = ""; }}
      {...rest}
    >
      {children}
    </button>
  );
}
