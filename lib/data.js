// Données du site ATAIA — toutes les images vivent dans /public/images/<slug>/<index>.jpg

export const img = (slug, i) => `/images/${slug}/${i}.jpg`;

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
    layout: "vertical",
    title: "Aménagement Cité Alpha Djadi",
    domain: "Urbanisme",
    kicker: "Urbanisme · Aménagement",
    loc: "Niamey, Niger",
    desc: "Projet d'aménagement pour la cité Alpha Djadi.",
    main: 0,
    gallery: [0, 1, 2, 3, 4],
  },
  {
    n: "03",
    key: "p3",
    slug: "bureaux-tahoua",
    layout: "mosaic",
    title: "Immeuble de bureaux à Tahoua",
    domain: "Architecture",
    kicker: "Architecture · Tertiaire",
    loc: "Tahoua, Niger",
    desc: "Projet d'immeuble à usage de bureaux à Tahoua.",
    main: 0,
    gallery: [0, 1, 2],
  },
  {
    n: "04",
    key: "p4",
    slug: "maradi-culture",
    layout: "compare",
    title: "Maison de la Culture de Maradi",
    domain: "Architecture",
    kicker: "Architecture · Culturel",
    loc: "Maradi, Niger",
    desc: "Projet de la nouvelle Maison de la Culture de Maradi — entrée principale.",
    main: 0,
    gallery: [0, 1, 2],
    details: [
      ["Localisation", "Maradi, Niger"],
      ["Programme", "Nouvelle Maison de la Culture de Maradi — entrée principale"],
    ],
  },
  {
    n: "05",
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
    n: "06",
    key: "p6",
    slug: "villa-ua",
    layout: "grid",
    title: "Villa présidentielle — Sommet de l'UA 2019",
    domain: "Architecture",
    kicker: "Architecture · Concours",
    loc: "Niamey, Niger",
    desc: "Projet de construction d'une villa présidentielle, réalisé dans le cadre du concours pour le sommet de l'Union Africaine 2019.",
    main: 0,
    gallery: [0, 1, 2, 3],
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
  slides: [
    { slug: "maradi-culture", i: 1, cap: "Réalisation — Maison de la Culture de Maradi" },
    { slug: "cite-alpha-djadi", i: 0, cap: "Réalisation — Aménagement Cité Alpha Djadi" },
    { slug: "bureaux-tahoua", i: 1, cap: "Réalisation — Immeuble de bureaux à Tahoua" },
    { slug: "bceao-tahoua", i: 2, cap: "Réalisation — Concours BCEAO Tahoua" },
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
  { title: "Ingénierie", desc: "Structure, fluides et coordination technique.", slug: "bureaux-tahoua", i: 2 },
  { title: "Conseil", desc: "Programmation et accompagnement de projet.", slug: "bceao-tahoua", i: 3 },
];

export const CONTACT_SLIDES = [
  { slug: "villa-ua", i: 1, cap: "Villa présidentielle — Sommet de l'UA 2019" },
  { slug: "bureaux-tahoua", i: 1, cap: "Immeuble de bureaux à Tahoua" },
  { slug: "bureaux-tahoua", i: 2, cap: "Immeuble de bureaux à Tahoua" },
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
