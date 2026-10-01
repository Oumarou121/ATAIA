"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const nodemailer = require("nodemailer");
const { SMTPServer } = require("smtp-server");
const { simpleParser } = require("mailparser");
const { createContactHandler, _resetRateLimit } = require("../contact");

// Faux serveur SMTP local qui garde les messages reçus.
let server, port;
const inbox = [];
test.before(async () => {
  server = new SMTPServer({
    authOptional: true,
    disabledCommands: ["STARTTLS", "AUTH"],
    onData(stream, _s, done) {
      const chunks = [];
      stream.on("data", (c) => chunks.push(c));
      stream.on("end", async () => { inbox.push(await simpleParser(Buffer.concat(chunks))); done(); });
    },
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  port = server.server.address().port;
});
test.after(() => server.close());
test.beforeEach(() => { inbox.length = 0; _resetRateLimit(); });

const baseCfg = () => ({
  host: "127.0.0.1", port, user: "site@ataia.test", pass: "secret-pass",
  to: "contact@ataia.test", from: "site@ataia.test", allowedOrigins: [],
});
const make = (cfg = {}, createTransport) =>
  createContactHandler({
    getConfig: () => ({ ...baseCfg(), ...cfg }),
    createTransport: createTransport || ((o) => nodemailer.createTransport({ host: o.host, port: o.port, secure: false, ignoreTLS: true })),
  });

function call(handler, { method = "POST", body, headers = {} } = {}) {
  const h = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  return new Promise((resolve) => {
    const out = { status: 200, headers: {}, json: null };
    const res = {
      set: (k, v) => { out.headers[k] = v; return res; },
      status: (s) => { out.status = s; return res; },
      json: (j) => { out.json = j; resolve(out); return res; },
    };
    handler({ method, body, get: (k) => h[k.toLowerCase()], ip: "1.2.3.4" }, res);
  });
}
const valid = { name: "Aïssa Moussa", email: "aissa@example.com", message: "Bonjour,\nJ'ai un projet de villa à Niamey." };

test("envoie un e-mail complet à l'agence, avec « Répondre » vers le visiteur", async () => {
  const r = await call(make(), { body: valid });
  assert.equal(r.status, 200);
  assert.deepEqual(r.json, { ok: true });
  assert.equal(inbox.length, 1);
  const m = inbox[0];
  assert.equal(m.to.value[0].address, "contact@ataia.test");
  assert.equal(m.from.value[0].address, "site@ataia.test");
  assert.equal(m.replyTo.value[0].address, "aissa@example.com");
  assert.equal(m.subject, "Nouveau message du site — Aïssa Moussa");
  assert.match(m.text, /Nom : Aïssa Moussa/);
  assert.match(m.text, /J'ai un projet de villa à Niamey\./);
});

test("neutralise l'injection d'en-têtes et échappe le HTML", async () => {
  const r = await call(make(), { body: { name: "Bob\r\nBcc: pirate@evil.test", email: "bob@example.com", message: "<script>alert(1)</script>" } });
  assert.equal(r.status, 200);
  const m = inbox[0];
  assert.equal(m.bcc, undefined);
  assert.ok(!/pirate@evil\.test/.test(JSON.stringify(m.to) + JSON.stringify(m.cc || "")));
  assert.ok(!m.html.includes("<script>"));
  assert.match(m.html, /&lt;script&gt;/);
});

test("refuse les champs manquants, e-mail invalide et textes trop longs", async () => {
  const h = make();
  assert.equal((await call(h, { body: { ...valid, name: "" } })).status, 400);
  assert.equal((await call(h, { body: { ...valid, message: "  " } })).status, 400);
  const bad = await call(h, { body: { ...valid, email: "pas-un-mail" } });
  assert.equal(bad.status, 400);
  assert.equal(bad.json.error, "Adresse e-mail invalide.");
  assert.equal((await call(h, { body: { ...valid, message: "x".repeat(5001) } })).status, 400);
  assert.equal((await call(h, { body: undefined })).status, 400);
  assert.equal(inbox.length, 0);
});

test("accepte sans rien envoyer quand le champ piège est rempli", async () => {
  const r = await call(make(), { body: { ...valid, website: "http://spam.test" } });
  assert.equal(r.status, 200);
  assert.equal(inbox.length, 0);
});

test("refuse les méthodes autres que POST", async () => {
  const r = await call(make(), { method: "GET" });
  assert.equal(r.status, 405);
  assert.equal(r.headers.Allow, "POST");
});

test("filtre les origines quand une liste est configurée", async () => {
  const h = make({ allowedOrigins: ["https://ataiau.web.app"] });
  assert.equal((await call(h, { body: valid, headers: { Origin: "https://autre-site.test" } })).status, 403);
  assert.equal((await call(h, { body: valid, headers: { Origin: "https://ataiau.web.app" } })).status, 200);
  assert.equal((await call(h, { body: valid })).status, 200); // appel sans en-tête Origin
});

test("limite à 5 messages par IP sur 10 minutes", async () => {
  const h = make();
  for (let i = 0; i < 5; i++) assert.equal((await call(h, { body: valid })).status, 200);
  const r = await call(h, { body: valid });
  assert.equal(r.status, 429);
  assert.equal(inbox.length, 5);
});

test("répond 502 sans fuite d'information si le serveur SMTP est injoignable", async () => {
  const errors = [];
  const orig = console.error; console.error = (...a) => errors.push(a.join(" "));
  try {
    const h = make({ port: 1, pass: "secret-pass" }, (o) => nodemailer.createTransport({ host: o.host, port: 1, secure: false, ignoreTLS: true, connectionTimeout: 1500 }));
    const r = await call(h, { body: valid });
    assert.equal(r.status, 502);
    assert.ok(!JSON.stringify(r.json).includes("secret-pass"));
    assert.match(r.json.error, /L'envoi a échoué/);
    assert.ok(errors.length >= 1 && !errors.join().includes("secret-pass"));
  } finally { console.error = orig; }
});
