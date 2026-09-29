// Données du site ATAIA — toutes les images vivent dans /public/images/<slug>/<index>.jpg
// (sauf les exceptions listées dans PNG_IMAGES ci-dessous, qui sont en .png)

// Images qui ne sont pas en .jpg : clé "<slug>/<index>". Ajouter ici toute autre exception.
const PNG_IMAGES = new Set([
  // images principales des projets
  "bceao-tahoua/0",
  "cite-alpha-djadi/0",
  "maradi-culture/0",
  "afer/0",
  "villa-ua/0",
  // autres images en .png
  "bceao-tahoua/1",
  "bceao-tahoua/2",
  "bceao-tahoua/6",
  "bceao-tahoua/7",
  "cite-alpha-djadi/2",
]);

export const img = (slug, i) => `/images/${slug}/${i}.${PNG_IMAGES.has(`${slug}/${i}`) ? "png" : "jpg"}`;

export const SITE = {
  name: "ATAIA",
  city: "Niamey, Niger",
  tagline: "Architecture · Urbanisme · Ingénierie",
  description:
    "ATAIA est une agence d'architecture, d'urbanisme et d'ingénierie basée à Niamey, Niger.",
};

export const NAV_LINKS = [
  { href: "#projects", label: "Projets" },
  { href: "#villas-residences", label: "Villas & Résidences" },
  { href: "#agency", label: "Agence" },
  { href: "#contact", label: "Contact" },
];

// layout : carousel | vertical | mosaic | compare | gallery | grid
export const PROJECTS = [
  {
    n: "01",
    key: "p1",
    slug: "bceao-tahoua",
    layout: "carousel",
    title: "Concours BCEAO Tahoua",
    domain: "Architecture",
    kicker: "Architecture · Concours",
    loc: "Tahoua, Niger",
    desc: "Proposition architecturale réalisée dans le cadre du concours pour l'agence BCEAO de Tahoua.",
    main: 0,
    gallery: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    n: "02",
    key: "p2",
    slug: "cite-alpha-djadi",
    layout: "chapters",
    title: "Aménagement Cité Alpha Djadi",
    domain: "Urbanisme",
    kicker: "Urbanisme · Aménagement",
    loc: "Niamey, Niger",
    desc: "Projet d'aménagement pour la cité Alpha Djadi.",
    main: 0,
    gallery: [0, 1, 2, 3, 4],
    // Lecture en trois échelles : du plan d'ensemble à la rue. `wide` = recadrage 16/10 (sinon ratio natif ≈ 9/8).
    chapters: [
      {
        label: "Le quartier",
        note: "Vue d'ensemble : une place plantée au centre, les parcelles en couronne.",
        views: [{ i: 0, wide: true, pos: "50% 42%", alt: "Cité Alpha Djadi, vue aérienne : place engazonnée plantée d'arbres, entourée de parcelles closes par des murs" }],
      },
      {
        label: "Les îlots",
        note: "Rangées de maisons individuelles, cours et clôtures.",
        views: [
          { i: 1, alt: "Cité Alpha Djadi, vue aérienne oblique : rangées de maisons à toit gris, cours murées et arbres" },
          { i: 2, alt: "Cité Alpha Djadi, vue aérienne rapprochée de deux maisons avec porche, au premier plan" },
        ],
      },
      {
        label: "La rue",
        note: "Le quartier à hauteur de piéton.",
        views: [
          { i: 3, alt: "Cité Alpha Djadi, vue depuis la place engazonnée : arbres, promeneurs et maisons en fond" },
          { i: 4, alt: "Cité Alpha Djadi, rue en terre bordée de murs de clôture, avec une voiture jaune" },
        ],
      },
    ],
    details: [
      ["Domaine", "Urbanisme · Aménagement"],
      ["Localisation", "Niamey, Niger"],
      // À compléter si besoin : ["Surface", "…"], ["Logements", "…"], ["Maîtrise d'ouvrage", "…"], ["Année", "…"],
    ],
  },
  {
    n: "03",
    key: "p4",
    slug: "maradi-culture",
    layout: "carousel",
    title: "Maison de la Culture de Maradi",
    domain: "Architecture",
    kicker: "Architecture · Culturel",
    loc: "Maradi, Niger",
    desc: "Projet de la nouvelle Maison de la Culture de Maradi — entrée principale.",
    main: 0,
    showMain: false, // le carrousel montre déjà les 3 vues, pas d'image principale en plus
    gallery: [0, 1, 2],
    focus: ["50% 25%", "50% 55%", "50% 30%"], // cadrage de chaque vue dans le carrousel (haut de l'arche / du dôme)
    details: [
      ["Localisation", "Maradi, Niger"],
      ["Programme", "Nouvelle Maison de la Culture de Maradi — entrée principale"],
    ],
  },
  {
    n: "04",
    key: "p5",
    slug: "afer",
    layout: "gallery",
    title: "AFER",
    domain: "Architecture",
    kicker: "Architecture",
    loc: "Niamey, Niger",
    desc: "Projet AFER.",
    main: 0,
    gallery: [0, 1, 2, 3, 4],
  },
  {
    n: "05",
    key: "p6",
    slug: "villa-ua",
    layout: "compare",
    title: "Villa présidentielle — Sommet de l'UA 2019",
    domain: "Architecture",
    kicker: "Architecture · Concours",
    loc: "Niamey, Niger",
    desc: "Projet de construction d'une villa présidentielle, réalisé dans le cadre du concours pour le sommet de l'Union Africaine 2019.",
    main: 0,
    gallery: [0, 1, 2, 3], // 0 = jour, 1 = nuit (même vue, pour le comparateur) ; 2 et 3 = vues complémentaires
    compareLabels: ["Jour", "Nuit"],
    compareIcons: ["sun", "moon"],
    compareAlts: [
      "Villa présidentielle, vue de jour depuis la rue : façade aux claustras blancs et rouges, drapeau du Niger et palmiers",
      "Villa présidentielle, vue de nuit depuis la rue : façade éclairée, ciel étoilé et croissant de lune",
    ],
    compareRatio: "5/4", // ratio des rendus (≈ 1,25) : plus de recadrage du bas des images
    // Recalage de la vue de nuit (caméra plus large que celle de jour) : scale + décalage en % du cadre,
    // pour que la villa se superpose à la vue de jour quand on fait glisser le curseur.
    // Idéal : refaire le rendu de nuit avec la même caméra, puis supprimer cette ligne.
    compareAlign: [null, { scale: 1.3, x: -30, y: -11.5 }],
    compareViews: [
      { cap: "Vue d'ensemble de l'avenue", alt: "Villa présidentielle — vue d'ensemble de l'avenue bordée de villas et de palmiers" },
      { cap: "Alignement des villas, vue de face", alt: "Villa présidentielle — alignement des villas vu de face depuis l'avenue, au coucher du soleil" },
    ],
    details: [
      ["Programme", "Villa présidentielle"],
      ["Concours", "Sommet de l'Union Africaine 2019"],
      ["Localisation", "Niamey, Niger"],
    ],
  },
];

export const INTRO = [
  "ATAIA est une agence d'architecture, d'urbanisme et d'ingénierie basée à Niamey.",
  "Nous concevons des espaces ancrés dans leur contexte — cette galerie se parcourt comme une exposition.",
];

export const AGENCY = {
  title: "ATAIA",
  domains: "Architecture · Urbanisme · Ingénierie · Conseil",
  text: "Fondée à Niamey, l'agence conçoit des bâtiments et des espaces publics adaptés aux usages et aux climats de la région.",
  // Photos de l'agence (dossier /public/images/ATAIA) — ordre d'affichage : accueil, panorama, détail, second cadrage.
  // `pos` = point de cadrage (object-position) quand l'image est recadrée, surtout sur mobile.
  photos: [
    { slug: "ATAIA", i: 1, cap: "Espace d'accueil", pos: "50% 50%" },
    { slug: "ATAIA", i: 3, cap: "Bureau de direction — vue d'ensemble", pos: "62% 50%" },
    { slug: "ATAIA", i: 4, cap: "Poste de travail", pos: "50% 50%" },
    { slug: "ATAIA", i: 2, cap: "Bureau de direction — autre cadrage", pos: "68% 50%" },
  ],
};

// Organigramme : arbre récursif { label, kind, children }
export const ORG = {
  label: "Directeur Général",
  kind: "root",
  children: [
    { label: "Directeur de l'Administration et Comptabilité" },
    {
      label: "Directeur Urbanisme, Aménagement Urbain et du Territoire",
      children: [
        { label: "Cartographie et système d'information géographique", kind: "leaf" },
        { label: "Division études et formations", kind: "leaf" },
      ],
    },
    {
      label: "Directeur Architecture et construction",
      children: [
        { label: "Division projets recherche et prospective", kind: "leaf" },
        { label: "Division suivi contrôle et architecture du bureau", kind: "leaf" },
      ],
    },
  ],
};

export const MANIFESTO =
  "Construire avec le climat, le lieu et la mémoire des matériaux — plutôt que contre eux.";

export const DOMAINS = [
  { title: "Architecture", desc: "Bâtiments résidentiels, culturels et publics.", slug: "maradi-culture", i: 0 },
  { title: "Urbanisme", desc: "Schémas directeurs et aménagement de quartiers.", slug: "cite-alpha-djadi", i: 2 },
  { title: "Ingénierie", desc: "Structure, fluides et coordination technique.", slug: "afer", i: 2 },
  { title: "Conseil", desc: "Programmation et accompagnement de projet.", slug: "bceao-tahoua", i: 1 },
];

export const CONTACT_SLIDES = [
  { slug: "bceao-tahoua", i: 0, cap: "Concours BCEAO Tahoua" },
  { slug: "afer", i: 0, cap: "AFER" },
  { slug: "maradi-culture", i: 0, cap: "Maison de la Culture de Maradi" },
  { slug: "villa-ua", i: 0, cap: "Villa présidentielle — Sommet de l'UA 2019" },
];

export const VILLAS = [
  { slug: "villa-1", name: "Villa 1", n: 2 },
  { slug: "villa-2", name: "Villa 2", n: 2 },
  { slug: "villa-cite-alpha", name: "Cité Alpha Djadi", n: 2 },
  { slug: "villa-cite-alpha-2", name: "Villa — Cité Alpha Djadi", n: 3 },
  { slug: "villa-ousseini", name: "Villa — M. Ousseini", n: 2 },
  { slug: "villa-csi-stc", name: "Logement chef CSI — Save The Children", n: 2 },
  { slug: "villa-residence-adamou", name: "Résidence Adamou", n: 2 },
  { slug: "villa-residence-boubacar", name: "Résidence Boubacar", n: 2 },
  { slug: "villa-hadi", name: "Villa Hadi", n: 2 },
  { slug: "villa-autres", name: "Autres vues", n: 5 },
];

export const RESIDENCES = [
  { slug: "res-1", name: "Résidence 1", n: 4 },
  { slug: "res-2", name: "Résidence 2", n: 3 },
  { slug: "res-locatifs", name: "Logements locatifs", n: 2 },
  { slug: "res-abdoulsalam", name: "Résidence Abdoulsalam", n: 2 },
];

// Voisins pour la navigation précédent / suivant
export function neighbours(index) {
  const prev = index > 0 ? PROJECTS[index - 1] : null;
  const next =
    index < PROJECTS.length - 1
      ? PROJECTS[index + 1]
      : { href: "#agency", title: "L'agence", slug: PROJECTS[0].slug, main: 0 };
  return { prev, next };
}