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

- `app/` — pages Next.js (App Router) et layout
- `functions/` — Cloud Function d'envoi du formulaire de contact (voir plus bas)
- `components/` — un composant par section (Hero, ProjectSection, VillasResidences,
  Agency, OrgChart, Domains, Contact, Lightbox…)
- `hooks/` — `useSlider` (carrousel générique glisser/clavier/molette/autoplay),
  `useDragScroll` (galerie horizontale au glisser)
- `lib/data.js` — **toutes les données du site** (projets, villas, résidences,
  organigramme, domaines, textes)
- `public/images/<slug>/<n>.webp` — les photos, chaque groupe (projet, villa,
  résidence) dans son propre dossier. Elles sont produites par `npm run images`
  (voir `scripts/optimize-images.mjs`) ; garder les originaux hors du projet.
- `public/og.jpg` — image d'aperçu pour le partage (WhatsApp, réseaux), générée par le même script
- `components/Photo.jsx` — photo `next/image` qui remplit son cadre (`sizes` = largeur affichée)
- `app/globals.css` — le CSS du site (repris de la maquette)

## Formulaire de contact (envoi d'e-mail)

Le site est exporté en statique (`output: 'export'`) et hébergé sur Firebase Hosting :
il n'a donc pas de serveur Next.js. L'envoi du formulaire passe par une **Cloud Function**
(`functions/`, fonction `contact`, région `europe-west1`) que `firebase.json` expose sur
`/api/contact` : le formulaire poste toujours vers cette même adresse.

La fonction valide les champs, ignore les robots (champ piège), limite à 5 messages par IP
et par 10 minutes, puis envoie le message en SMTP à l'agence. « Répondre » écrit directement au visiteur.

### Mise en route (une seule fois)

Prérequis : projet Firebase `ataiau` sur le forfait **Blaze** (obligatoire pour les Cloud Functions
et les secrets ; l'usage d'un petit site de vitrine reste dans les quotas gratuits), et
`npm i -g firebase-tools` puis `firebase login`.

1. `cd functions && npm install && cd ..`
2. Copier `functions/.env.example` en `functions/.env` et renseigner `SMTP_HOST`, `SMTP_PORT`,
   `SMTP_USER`, `MAIL_TO` (adresse qui reçoit les messages) et `ALLOWED_ORIGINS`.
3. Enregistrer le mot de passe SMTP comme secret : `firebase functions:secrets:set SMTP_PASS`
4. Construire et publier : `npm run build` puis `firebase deploy`
   (ou `firebase deploy --only functions` / `--only hosting` séparément).

Compte d'envoi : idéalement une boîte sur le domaine de l'agence ; avec Gmail, activer la
validation en deux étapes et créer un « mot de passe d'application » (c'est lui, `SMTP_PASS`).

### Tester sans publier

```bash
cd functions && npm test          # 8 tests du gestionnaire, avec un faux serveur SMTP
npm run build                     # génère out/
firebase emulators:start --only functions,hosting
```
Pour l'émulateur, mettre les valeurs dans `functions/.env.local` et le mot de passe dans
`functions/.secret.local` (ligne `SMTP_PASS=...`). `npm run dev` seul n'a pas de route `/api/contact`.

### Dépannage

`firebase functions:log --only contact` : l'erreur SMTP réelle y est journalisée (le visiteur
ne voit qu'un message générique). Cas fréquents : mot de passe d'application manquant (Gmail),
port 465/587 inversé, `MAIL_FROM` n'appartenant pas au compte SMTP.

## Modifier le contenu

- **Ajouter/modifier un projet** : éditer le tableau `PROJECTS` dans
  `lib/data.js` (titre, description, disposition `layout`, images) puis
  déposer les photos dans `public/images/<slug>/`.
- **Dispositions disponibles** (`layout`) : `carousel`, `vertical`, `mosaic`,
  `compare` (comparateur + plan + accordéon), `gallery`, `grid`.
- **Villas / Résidences** : tableaux `VILLAS` et `RESIDENCES`.
- **Organigramme** : objet `ORG` (arbre récursif `{ label, children }`).
- **Coordonnées** (téléphones, e-mail, adresse) : objet `SITE.contact` dans `lib/data.js` ;
  elles alimentent la section Contact, le pied de page et les données structurées du référencement.
- **Domaines d'intervention** : tableau `DOMAINS` (titre, liste `services`, image `slug`/`i`).