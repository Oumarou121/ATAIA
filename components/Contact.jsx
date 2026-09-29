"use client";
import { useState } from "react";
import { CONTACT_SLIDES, bg } from "@/lib/data";
import { useSlider } from "@/hooks/useSlider";
import { Zoomable } from "./Lightbox";
import Reveal from "./Reveal";
import AutoplayToggle from "./AutoplayToggle";
import { useAutoplay } from "@/hooks/useAutoplay";

export default function Contact() {
  const { playing, canAutoplay, toggle } = useAutoplay();
  const s = useSlider({ count: CONTACT_SLIDES.length, auto: 4600, playing });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ state: "sending", msg: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Échec de l'envoi");
      setStatus({ state: "ok", msg: "Merci, votre message a bien été envoyé." });
      form.reset();
    } catch (err) {
      setStatus({ state: "error", msg: err.message || "Une erreur est survenue." });
    }
  }

  return (
    <section className="contact" id="contact" aria-label="Contact">
      <Reveal className="ct-carousel slider" role="region" aria-roledescription="carrousel" aria-label="Photographies de conclusion" {...s.rootProps}>
        <div className="sl-track" style={s.trackStyle}>
          {CONTACT_SLIDES.map((c, i) => (
            <Zoomable key={i} bg={bg(c.slug, c.i)} cap={c.cap} {...s.slideProps(i)} />
          ))}
        </div>
      </Reveal>
      <div className="ct-bar">
        <AutoplayToggle playing={playing} canAutoplay={canAutoplay} onToggle={toggle} />
      </div>

      <Reveal className="contact-row">
        <h2>Parlons de votre prochain projet.</h2>
        <form className="cform" onSubmit={onSubmit}>
          <div>
            <label htmlFor="cf-name">Nom</label>
            <input id="cf-name" name="name" type="text" required autoComplete="name" />
          </div>
          <div>
            <label htmlFor="cf-email">Email</label>
            <input id="cf-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="full">
            <label htmlFor="cf-msg">Message</label>
            <textarea id="cf-msg" name="message" rows={3} required />
          </div>
          <button type="submit" disabled={status.state === "sending"}>
            {status.state === "sending" ? "Envoi…" : "Envoyer →"}
          </button>
          {status.msg && (
            <p role="status" style={{ gridColumn: "1 / -1", fontSize: "13px", color: status.state === "error" ? "#d98a7a" : "var(--sub)" }}>
              {status.msg}
            </p>
          )}
        </form>
      </Reveal>
    </section>
  );
}
