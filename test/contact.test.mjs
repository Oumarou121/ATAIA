import test from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";
import { handleContact, _resetRateLimit } from "../lib/contact.mjs";

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
const make = (cfg = {}, createTransport) => (request) =>
  handleContact(request, {
    getConfig: () => ({ ...baseCfg(), ...cfg }),
    createTransport: createTransport || ((o) => nodemailer.createTransport({ host: o.host, port: o.port, secure: false, ignoreTLS: true })),
  });

async function call(handler, { method = "POST", body, headers = {}, raw } = {}) {
  const init = { method, headers: { "x-forwarded-for": "1.2.3.4", ...headers } };
  if (method !== "GET") {
    init.headers["content-type"] = "application/json";
    init.body = raw !== undefined ? raw : JSON.stringify(body);
  }
  const res = await handler(new Request("https://ataia.test/api/contact", init));
  return { status: res.status, headers: Object.fromEntries(res.headers), json: await res.json() };
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
  assert.equal((await call(h, { raw: "pas du json" })).status, 400);
  assert.equal(inbox.length, 0);
});

test("accepte sans rien envoyer quand le champ piège est rempli", async () => {
  const r = await call(make(), { body: { ...valid, website: "http://spam.test" } });
  assert.equal(r.status, 200);
  assert.equal(inbox.length, 0);
});

test("refuse les origines étrangères, accepte la même origine et la liste autorisée", async () => {
  const h = make({ allowedOrigins: ["https://ataia.com"] });
  assert.equal((await call(h, { body: valid, headers: { Origin: "https://autre-site.test" } })).status, 403);
  assert.equal((await call(h, { body: valid, headers: { Origin: "https://ataia.test" } })).status, 200); // même origine
  assert.equal((await call(h, { body: valid, headers: { Origin: "https://ataia.com" } })).status, 200); // liste ALLOWED_ORIGINS
  assert.equal((await call(h, { body: valid })).status, 200); // appel sans en-tête Origin
});

test("répond 500 sans envoyer si la configuration SMTP est incomplète", async () => {
  const orig = console.error; console.error = () => {};
  try {
    const r = await call(make({ pass: "" }), { body: valid });
    assert.equal(r.status, 500);
    assert.equal(inbox.length, 0);
  } finally { console.error = orig; }
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
