import { ORG } from "@/lib/data";
import Reveal from "./Reveal";

const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Organigramme à trois niveaux (direction générale → directions → divisions).
 * Structure sémantique en listes imbriquées ; les connecteurs sont dessinés en CSS.
 * Les données (ORG dans lib/data.js) restent inchangées.
 */
export default function OrgChart() {
  const dirs = ORG.children ?? [];
  const divisions = dirs.reduce((t, d) => t + (d.children?.length ?? 0), 0);

  return (
    <Reveal className="org-wrap" threshold={0.08}>
      <div className="org-head">
        <h3 className="org-title">Organigramme de la société</h3>
        <p className="org-facts">
          {pad2(dirs.length)} directions · {pad2(divisions)} divisions
        </p>
      </div>

      <ul className="org-tree" aria-label="Organigramme de la société">
        <li className="org-root">
          <div className="org-card">
            <span className="org-lv">Direction générale</span>
            <span className="org-name">{ORG.label}</span>
          </div>

          <ul className="org-dirs" style={{ "--n": dirs.length }}>
            {dirs.map((d, i) => (
              <li key={d.label} className="org-dir">
                <div className="org-card">
                  <span className="org-lv">Direction {pad2(i + 1)}</span>
                  <span className="org-name">{d.label}</span>
                </div>

                {d.children?.length > 0 && (
                  <ul className="org-divs">
                    {d.children.map((c) => (
                      <li key={c.label}>
                        <div className="org-card">
                          <span className="org-name">{c.label}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </Reveal>
  );
}
