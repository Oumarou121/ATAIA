"use strict";
const nodemailer = require("nodemailer");

const LIMITS = { name: 120, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Anti-abus « au mieux » : au plus 5 messages par IP et par tranche de 10 minutes
// (compteur propre à chaque instance de la fonction).
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map();

function tooMany(ip, now = Date.now()) {
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  if (recent.length >= RATE.max) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const oneLine = (v) => String(v ?? "").replace(/[\r\n\t]+/g, " ").trim();
const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Fabrique le gestionnaire HTTP du formulaire de contact.
 * `getConfig()` renvoie { host, port, user, pass, to, from, allowedOrigins[] }.
 * `createTransport` est injectable pour les tests.
 */
function createContactHandler({ getConfig, createTransport = nodemailer.createTransport }) {
  return async function contact(req, res) {
    res.set("Cache-Control", "no-store");

    if (req.method !== "POST") {
      res.set("Allow", "POST");
      return res.status(405).json({ error: "Méthode non autorisée." });
    }

    const cfg = getConfig();

    // Les appels du site passent par Firebase Hosting (même origine). Si une liste
    // d'origines est fournie, on refuse les appels navigateur venant d'ailleurs.
    const origin = req.get("origin");
    if (origin && cfg.allowedOrigins.length && !cfg.allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: "Origine non autorisée." });
    }

    const body = req.body && typeof req.body === "object" ? req.body : null;
    if (!body) return res.status(400).json({ error: "Requête invalide." });

    // Champ piège (invisible pour les visiteurs) : un robot le remplit, on fait semblant d'accepter.
    if (oneLine(body.website)) return res.status(200).json({ ok: true });

    const name = oneLine(body.name);
    const email = oneLine(body.email);
    const message = String(body.message ?? "").replace(/\r\n/g, "\n").trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: "Adresse e-mail invalide." });
    }
    if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
      return res.status(400).json({ error: "Message trop long." });
    }

    const ip = (req.get("x-forwarded-for") || req.ip || "").split(",")[0].trim() || "inconnue";
    if (tooMany(ip)) {
      return res.status(429).json({ error: "Trop de messages envoyés. Réessayez dans quelques minutes." });
    }

    try {
      const transport = createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.port === 465, // 465 : TLS direct ; 587 : STARTTLS (exigé ci-dessous)
        requireTLS: cfg.port !== 465,
        auth: { user: cfg.user, pass: cfg.pass },
        connectionTimeout: 10000,
        socketTimeout: 15000,
      });

      await transport.sendMail({
        // L'expéditeur reste l'adresse du site (sinon le message est rejeté comme usurpation) ;
        // « Répondre » écrit directement au visiteur.
        from: { name: "ATAIA — site web", address: cfg.from },
        to: cfg.to,
        replyTo: { name: name.replace(/["<>]/g, ""), address: email },
        subject: `Nouveau message du site — ${name}`.slice(0, 200),
        text: `Nom : ${name}\nEmail : ${email}\n\n${message}\n`,
        html:
          `<p><strong>Nom :</strong> ${escapeHtml(name)}<br>` +
          `<strong>Email :</strong> ${escapeHtml(email)}</p>` +
          `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      // On journalise la cause (sans le mot de passe) mais on ne la montre pas au visiteur.
      console.error("[contact] échec d'envoi :", err && err.code, err && err.responseCode, err && err.message);
      return res.status(502).json({ error: "L'envoi a échoué. Réessayez plus tard ou écrivez-nous directement." });
    }
  };
}

module.exports = { createContactHandler, _resetRateLimit: () => hits.clear() };
