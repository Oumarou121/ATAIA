# ATAIA — site Next.js

Portage React/Next.js (App Router) de la maquette ATAIA. Les 6 projets, la
section Villas & Résidences, l'agence (avec organigramme), les domaines et le
contact sont pilotés depuis `lib/data.js` — modifier ce fichier pour changer
titres, textes ou l'ordre des projets, sans toucher aux composants.

## Démarrer en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

## Build de production

```bash
npm run build
npm start
```

## Structure

- `app/` — pages Next.js (App Router), layout, route API `/api/contact`
- `components/` — un composant par section (Hero, ProjectSection, VillasResidences,
  Agency, OrgChart, Domains, Contact, Lightbox…)
- `hooks/` — `useSlider` (carrousel générique glisser/clavier/molette/autoplay),
  `useDragScroll` (galerie horizontale au glisser)
- `lib/data.js` — **toutes les données du site** (projets, villas, résidences,
  organigramme, domaines, textes)
- `public/images/<slug>/<n>.jpg` — les photos, chaque groupe (projet, villa,
  résidence) dans son propre dossier (les images principales `0` des 6 projets sont en `.png` : voir `PNG_IMAGES` dans `lib/data.js`)
- `components/Photo.jsx` — photo `next/image` qui remplit son cadre (`sizes` = largeur affichée)
- `app/globals.css` — le CSS du site (repris de la maquette)

## Formulaire de contact

`app/api/contact/route.js` valide les champs et journalise le message. Pour
recevoir réellement les messages, y brancher un envoi d'e-mail (Resend,
Nodemailer/SMTP…) avec des variables d'environnement (`.env.local`, non
versionné).

## Modifier le contenu

- **Ajouter/modifier un projet** : éditer le tableau `PROJECTS` dans
  `lib/data.js` (titre, description, disposition `layout`, images) puis
  déposer les photos dans `public/images/<slug>/`.
- **Dispositions disponibles** (`layout`) : `carousel`, `vertical`, `mosaic`,
  `compare` (comparateur + plan + accordéon), `gallery`, `grid`.
- **Villas / Résidences** : tableaux `VILLAS` et `RESIDENCES`.
- **Organigramme** : objet `ORG` (arbre récursif `{ label, children }`).