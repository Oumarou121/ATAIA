// Convertit les images d'origine en WebP léger (2400 px max) pour le site.
//
// Usage :
//   1. Mettre les ORIGINAUX (png / jpg) dans  originals/<slug>/<n>.png|jpg  (même arborescence que public/images)
//   2. npm run images
//   3. Le résultat est écrit dans public/images/<slug>/<n>.webp, plus public/og.jpg (image de partage)
//
// Les originaux ne sont jamais modifiés. Le dossier originals/ n'est pas déployé (firebase.json ne publie que out/).
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "originals";
const OUT = "public/images";
const MAX_WIDTH = 2400;
const QUALITY = 82; // monter à 88-90 pour les plans et croquis très nets

if (!fs.existsSync(SRC)) {
  console.error(`Dossier "${SRC}" introuvable : placez-y vos images d'origine (originals/<slug>/<n>.png|jpg).`);
  process.exit(1);
}

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(png|jpe?g)$/i.test(e.name)) yield p;
  }
}

let before = 0;
let after = 0;
for (const file of walk(SRC)) {
  const rel = path.relative(SRC, file).replace(/\.(png|jpe?g)$/i, ".webp");
  const out = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(file).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
  before += fs.statSync(file).size;
  after += fs.statSync(out).size;
  console.log("OK", rel);
}
const mb = (n) => (n / 1048576).toFixed(1) + " Mo";
console.log(`\nAvant : ${mb(before)} — Après : ${mb(after)}`);

// Image de partage (WhatsApp, réseaux) : JPG 1200x630 à partir de la 1re image du concours BCEAO Tahoua.
const og = ["png", "jpg", "jpeg"].map((x) => path.join(SRC, "bceao-tahoua", `0.${x}`)).find((p) => fs.existsSync(p));
if (og) {
  await sharp(og).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 82 }).toFile("public/og.jpg");
  console.log("OK public/og.jpg");
} else {
  console.warn("Image de partage non créée : originals/bceao-tahoua/0.png introuvable (ajoutez public/og.jpg à la main).");
}
