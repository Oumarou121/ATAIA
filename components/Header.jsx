"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { NAV_LINKS, PROJECTS, SITE } from "@/lib/data";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [indicator, setIndicator] = useState(null); // ex. "03"
  const [menu, setMenu] = useState(false);
  const openBtn = useRef(null);
  const closeBtn = useRef(null);
  const mnav = useRef(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  // Indicateur "03 / 06" pendant qu'on parcourt les projets
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const projs = document.querySelectorAll(".proj[data-idx]");
    // une section est "courante" quand elle traverse la ligne médiane de l'écran
    const pio = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setIndicator(e.target.dataset.idx)),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    projs.forEach((s) => pio.observe(s));
    const hideOn = ["intro", "villas-residences"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const hio = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setIndicator(null)),
      { threshold: 0 }
    );
    hideOn.forEach((s) => hio.observe(s));
    return () => { pio.disconnect(); hio.disconnect(); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && closeMenu();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu]);

  useEffect(() => {
    if (menu) closeBtn.current?.focus();
  }, [menu]);

  useFocusTrap(mnav, menu);

  function closeMenu() {
    setMenu(false);
    openBtn.current?.focus();
  }

  return (
    <>
      <header id="hdr" className={solid ? "solid" : ""}>
        <nav aria-label="Navigation principale">
          <a className="brand" href="#top" aria-label={`${SITE.name} — retour en haut`}>
            <Image className="brand-logo" src="/logo/ataia.png" alt="" width={52} height={52} preload loading="eager" />
          </a>
          <span className="hdr-mid" hidden={!indicator} aria-hidden="true">
            {indicator && `${indicator} / ${String(PROJECTS.length).padStart(2, "0")}`}
          </span>
          <div className="nlinks">
            {NAV_LINKS.filter((l) => l.href !== "#contact").map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
            <a className="nav-cta" href="#contact">Contact</a>
          </div>
          <button
            ref={openBtn}
            className="burger"
            aria-label="Ouvrir le menu"
            aria-expanded={menu}
            aria-controls="mnav"
            onClick={() => setMenu(true)}
          >
            Menu
          </button>
        </nav>
      </header>

      <div ref={mnav} inert={!menu} className={`mnav${menu ? " open" : ""}`} id="mnav" role="dialog" aria-modal="true" aria-label="Navigation">
        <div className="mnav-top">
          <span className="brand">
            <Image className="brand-logo" src="/logo/ataia.png" alt={SITE.name} width={52} height={52} />
          </span>
          <button ref={closeBtn} onClick={closeMenu} aria-label="Fermer le menu">Fermer</button>
        </div>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={closeMenu}>{l.label}</a>
        ))}
      </div>
    </>
  );
}
