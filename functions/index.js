"use strict";
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret, defineString } = require("firebase-functions/params");
const { createContactHandler } = require("./contact");

// Paramètres non secrets : lus dans functions/.env (voir .env.example).
const SMTP_HOST = defineString("SMTP_HOST");
const SMTP_PORT = defineString("SMTP_PORT", { default: "465" });
const SMTP_USER = defineString("SMTP_USER");
const MAIL_TO = defineString("MAIL_TO");
const MAIL_FROM = defineString("MAIL_FROM", { default: "" });
const ALLOWED_ORIGINS = defineString("ALLOWED_ORIGINS", { default: "" });
// Mot de passe SMTP : secret (firebase functions:secrets:set SMTP_PASS).
const SMTP_PASS = defineSecret("SMTP_PASS");

const handler = createContactHandler({
  getConfig: () => ({
    host: SMTP_HOST.value(),
    port: Number(SMTP_PORT.value()) || 465,
    user: SMTP_USER.value(),
    pass: SMTP_PASS.value(),
    to: MAIL_TO.value(),
    from: MAIL_FROM.value() || SMTP_USER.value(),
    allowedOrigins: ALLOWED_ORIGINS.value().split(",").map((s) => s.trim()).filter(Boolean),
  }),
});

// Appelée par le site via la réécriture « /api/contact » de firebase.json.
exports.contact = onRequest(
  { region: "europe-west1", secrets: [SMTP_PASS], maxInstances: 3, timeoutSeconds: 30, memory: "256MiB", cors: false },
  handler
);
