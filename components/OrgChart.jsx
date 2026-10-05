/**
 * Organigramme de la société, redessiné d'après le prospectus ATAIA.
 *  - 3 couleurs selon le type d'entité : direction générale et directions (orange clair, texte vert),
 *    service (vert clair), divisions (bleu) ;
 *  - flèches à double sens pour chaque relation de travail.
 * Le dessin est un SVG (viewBox 1200 × 540) : `x`, `y`, `w`, `h` sont les coordonnées des cases, `lines` les lignes de texte.
 * Pour déplacer une case ou ajouter une relation, modifier NODES et LINKS ci-dessous.
 */
const NODES = {
  dg: { x: 510, y: 20, w: 180, h: 90, tone: "dir", size: 26, lines: ["Directeur", "Général"] },
  archi: { x: 115, y: 170, w: 235, h: 100, tone: "dir", size: 18, lines: ["Directeur", "Architecture et", "Construction"] },
  urba: { x: 842, y: 170, w: 250, h: 100, tone: "dir", size: 18, lines: ["Directeur Urbanisme,", "Aménagement Urbain", "et du Territoire"] },
  proj: { x: 10, y: 420, w: 190, h: 100, tone: "div", size: 17, lines: ["Division Projets-", "Recherche et", "Prospective"] },
  suivi: { x: 260, y: 420, w: 200, h: 100, tone: "div", size: 17, lines: ["Division Suivi-", "Contrôle et", "Archives du Bureau"] },
  serv: { x: 510, y: 420, w: 180, h: 100, tone: "svc", size: 18, lines: ["Service", "Administratif", "et Comptable"] },
  etud: { x: 740, y: 420, w: 200, h: 100, tone: "div", size: 17, lines: ["Division", "Études et", "Formations"] },
  carto: { x: 1000, y: 420, w: 190, h: 100, tone: "div", size: 17, lines: ["Cartographie et", "Système", "d'Information", "Géographique"] },
};

// Relations (flèches à double sens) : [case A, case B, x1, y1, x2, y2] — d'après le prospectus.
const LINKS = [
  ["dg", "archi", 508, 72, 352, 200],
  ["dg", "urba", 692, 72, 840, 200],
  ["dg", "serv", 600, 114, 600, 418],
  ["archi", "serv", 352, 255, 508, 440],
  ["urba", "serv", 840, 255, 692, 440],
  ["archi", "proj", 175, 272, 105, 418],
  ["archi", "suivi", 290, 272, 360, 418],
  ["proj", "suivi", 202, 470, 258, 470],
  ["urba", "etud", 900, 272, 840, 418],
  ["urba", "carto", 1030, 272, 1095, 418],
  ["etud", "carto", 942, 470, 998, 470],
];

const label = (id) => NODES[id].lines.join(" ").replace("- ", "-");

export const ORG_TONES = [
  { tone: "dir", name: "Direction générale et directions" },
  { tone: "svc", name: "Service administratif" },
  { tone: "div", name: "Divisions" },
];

export default function OrgChart() {
  return (
    <div className="org-scroll">
      <svg className="org-svg" viewBox="0 0 1200 540" role="img" aria-labelledby="org-t org-d">
        <title id="org-t">Organigramme de la société</title>
        <desc id="org-d">
          Le Directeur Général est en relation avec le Directeur Architecture et Construction, le Directeur Urbanisme et le
          Service Administratif et Comptable. Les relations de travail sont listées sous le schéma.
        </desc>
        <defs>
          <marker id="org-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="org-head" />
          </marker>
        </defs>

        {LINKS.map(([a, b, x1, y1, x2, y2]) => (
          <line key={a + b} className="org-link" x1={x1} y1={y1} x2={x2} y2={y2} markerStart="url(#org-arr)" markerEnd="url(#org-arr)" />
        ))}

        {Object.entries(NODES).map(([id, n]) => {
          const lh = Math.round(n.size * 1.22);
          const top = n.y + n.h / 2 - ((n.lines.length - 1) * lh) / 2;
          return (
            <g key={id} className={`org-node ${n.tone}`}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="16" />
              {n.lines.map((t, i) => (
                <text key={t} x={n.x + n.w / 2} y={top + i * lh} textAnchor="middle" dominantBaseline="central" fontSize={n.size}>
                  {t}
                </text>
              ))}
            </g>
          );
        })}
      </svg>

      <ul className="org-sr">
        {LINKS.map(([a, b]) => (
          <li key={a + b}>
            {label(a)} en lien avec {label(b)}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Texte d'accompagnement : effectifs et légende des trois couleurs. */
export function OrgNotes() {
  const count = (t) => Object.values(NODES).filter((n) => n.tone === t).length;
  const pad2 = (n) => String(n).padStart(2, "0");
  return (
    <div className="org-notes">
      <p className="org-facts">
        {pad2(count("dir") - 1)} directions · {pad2(count("svc"))} service · {pad2(count("div"))} divisions
      </p>
      <ul className="org-key" aria-label="Légende des couleurs">
        {ORG_TONES.map((t) => (
          <li key={t.tone}>
            <i className={t.tone} aria-hidden="true" />
            {t.name}
          </li>
        ))}
        <li>
          <span className="org-key-arrow" aria-hidden="true">↔</span> Relation de travail
        </li>
      </ul>
    </div>
  );
}
