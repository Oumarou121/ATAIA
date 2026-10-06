"use client";
import { useState } from "react";
import { CONTACT_IMAGE, img } from "@/lib/data";
import { Zoomable } from "./Lightbox";
import Reveal from "./Reveal";
import WhatsAppButton from "./WhatsAppButton";

export default function Contact() {
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
      <Reveal img className="ct-visual">
        <Zoomable src={img(CONTACT_IMAGE.slug, CONTACT_IMAGE.i)} sizes="(max-width: 900px) 100vw, 1240px" cap={CONTACT_IMAGE.cap} />
      </Reveal>

      <Reveal className="contact-row">
        <div className="ct-left">
          <h2>Parlons de votre prochain projet.</h2>
          <WhatsAppButton />
        </div>
        <form className="cform" onSubmit={onSubmit}>
          {/* champ piège anti-robots : invisible et ignoré des visiteurs */}
          <div className="cf-hp" aria-hidden="true">
            <label htmlFor="cf-website">Ne pas remplir</label>
            <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
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