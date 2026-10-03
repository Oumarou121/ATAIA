// Envoi du formulaire de contact : validation + e-mail SMTP.
// Utilisé par app/api/contact/route.js ; séparé pour pouvoir être testé (npm test).
import nodemailer from "nodemailer";

const LIMITS = { name: 120, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Anti-abus « au mieux » : au plus 5 messages par IP et par tranche de 10 minutes
// (compteur propre à chaque instance du serveur, donc approximatif sur Vercel).
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map();

function tooMany(ip, now = Date.now()) {
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  if (recent.length >= RATE.max) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const oneLine = (v) => String(v ?? "").replace(/[\r\n\t]+/g, " ").trim();
const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const json = (status, body, headers = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** Configuration lue dans les variables d'environnement (Vercel : Settings → Environment Variables). */
export function configFromEnv(env = process.env) {
  const user = env.SMTP_USER || "";
  return {
    host: env.SMTP_HOST || "",
    port: Number(env.SMTP_PORT) || 465,
    user,
    pass: env.SMTP_PASS || "",
    to: env.MAIL_TO || "",
    from: env.MAIL_FROM || user,
    allowedOrigins: (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean),
  };
}

export function _resetRateLimit() {
  hits.clear();
}

/**
 * Traite la requête POST du formulaire et renvoie une Response.
 * `getConfig()` renvoie { host, port, user, pass, to, from, allowedOrigins[] }.
 * `createTransport` est injectable pour les tests.
 */
export async function handleContact(request, { getConfig = configFromEnv, createTransport = nodemailer.createTransport } = {}) {
  const cfg = getConfig();

  // Les appels du site viennent de la même origine. On refuse les appels navigateur venant d'ailleurs,
  // sauf origines explicitement autorisées (ALLOWED_ORIGINS).
  const origin = request.headers.get("origin");
  if (origin) {
    let originHost = "";
    try { originHost = new URL(origin).host; } catch { /* origine invalide */ }
    const ownHosts = [new URL(request.url).host, request.headers.get("x-forwarded-host")].filter(Boolean);
    const ok = ownHosts.includes(originHost) || cfg.allowedOrigins.includes(origin);
    if (!ok) return json(403, { error: "Origine non autorisée." });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json(400, { error: "Requête invalide." });
  }

  // Champ piège (invisible pour les visiteurs) : un robot le remplit, on fait semblant d'accepter.
  if (oneLine(body.website)) return json(200, { ok: true });

  const name = oneLine(body.name);
  const email = oneLine(body.email);
  const message = String(body.message ?? "").replace(/\r\n/g, "\n").trim();

  if (!name || !email || !message) return json(400, { error: "Tous les champs sont requis." });
  if (!EMAIL_RE.test(email)) return json(400, { error: "Adresse e-mail invalide." });
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return json(400, { error: "Message trop long." });
  }

  const ip =
    (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "").split(",")[0].trim() || "inconnue";
  if (tooMany(ip)) {
    return json(429, { error: "Trop de messages envoyés. Réessayez dans quelques minutes." });
  }

  if (!cfg.host || !cfg.user || !cfg.pass || !cfg.to || !cfg.from) {
    console.error("[contact] configuration SMTP incomplète (SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_TO).");
    return json(500, { error: "L'envoi est momentanément indisponible. Écrivez-nous directement." });
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
    return json(200, { ok: true });
  } catch (err) {
    // On journalise la cause (sans le mot de passe) mais on ne la montre pas au visiteur.
    console.error("[contact] échec d'envoi :", err && err.code, err && err.responseCode, err && err.message);
    return json(502, { error: "L'envoi a échoué. Réessayez plus tard ou écrivez-nous directement." });
  }
}
