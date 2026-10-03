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
- `app/api/contact/` et `lib/contact.mjs` — envoi du formulaire de contact (voir plus bas)
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

Le site est un projet Next.js **avec serveur**, hébergé sur **Vercel**. L'envoi du formulaire passe par la
route API `app/api/contact/route.js` (qui s'exécute côté serveur, comme une fonction serverless) ;
la logique est dans `lib/contact.mjs`. Le formulaire poste vers `/api/contact`.

Elle valide les champs, ignore les robots (champ piège), limite à 5 messages par IP et par 10 minutes
(au mieux : compteur par instance), refuse les appels venant d'un autre site, puis envoie le message en
SMTP à l'agence. « Répondre » écrit directement au visiteur.

### Mise en route sur Vercel (une seule fois)

1. Pousser le projet sur GitHub, puis sur vercel.com : **Add New → Project**, choisir le dépôt
   (Framework : Next.js, réglages par défaut).
2. **Settings → Environment Variables** : ajouter les variables de `.env.example`
   (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`, et `NEXT_PUBLIC_SITE_URL`
   avec l'adresse du site). `SMTP_PASS` est un secret : ne jamais le mettre dans le code.
3. **Redéployer** (Deployments → ⋯ → Redeploy) : les variables ne s'appliquent qu'aux déploiements suivants.
4. Nom de domaine : **Settings → Domains**, puis mettre à jour `NEXT_PUBLIC_SITE_URL` et redéployer.

Compte d'envoi : idéalement une boîte sur le domaine de l'agence ; avec Gmail, activer la
validation en deux étapes et créer un « mot de passe d'application » (c'est lui, `SMTP_PASS`).

### Tester

```bash
npm test                 # tests du formulaire, avec un faux serveur SMTP
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev              # /api/contact fonctionne aussi en local
```

### Dépannage

Vercel : onglet **Logs** du projet (filtrer « contact ») : l'erreur SMTP réelle y est journalisée
(le visiteur ne voit qu'un message générique). Cas fréquents : variable d'environnement oubliée ou
projet non redéployé après l'avoir ajoutée, mot de passe d'application manquant (Gmail),
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