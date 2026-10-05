import { ORG } from "@/lib/data";
import Reveal from "./Reveal";

const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Organigramme (direction générale → directions et service → divisions).
 * Structure sémantique en listes imbriquées ; les connecteurs sont dessinés en CSS :
 * traits pleins = liens hiérarchiques, traits en pointillés = relations de coordination
 * (service administratif ↔ directions, divisions d'une même direction entre elles).
 * L'ordre des colonnes (direction, service, direction) est celui du prospectus : le service est au centre.
 * Données : ORG dans lib/data.js.
 */
export default function OrgChart() {
  const dirs = ORG.children ?? [];
  const services = dirs.filter((d) => d.kind === "service").length;
  const divisions = dirs.reduce((t, d) => t + (d.children?.length ?? 0), 0);
  let dirNo = 0;

  return (
    <Reveal className="org-wrap" threshold={0.08}>
      <div className="org-head">
        <h3 className="org-title">Organigramme de la société</h3>
        <p className="org-facts">
          {pad2(dirs.length - services)} directions · {pad2(services)} service · {pad2(divisions)} divisions
        </p>
      </div>

      <ul className="org-tree" aria-label="Organigramme de la société">
        <li className="org-root">
          <div className="org-card">
            <span className="org-lv">Direction générale</span>
            <span className="org-name">{ORG.label}</span>
          </div>

          <ul className="org-dirs" style={{ "--n": dirs.length }}>
            {dirs.map((d) => {
              const isService = d.kind === "service";
              return (
                <li key={d.label} className={`org-dir${isService ? " org-service" : ""}`}>
                  <div className="org-card">
                    <span className="org-lv">{isService ? "Service" : `Direction ${pad2(++dirNo)}`}</span>
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
              );
            })}
          </ul>
        </li>
      </ul>

      {ORG.links?.length > 0 && (
        <div className="org-rel">
          <h4 className="org-rel-title">Relations de travail</h4>
          <p className="org-rel-key">
            <span className="k-solid" aria-hidden="true" /> lien hiérarchique
            <span className="k-dash" aria-hidden="true" /> coordination
          </p>
          <ul>
            {ORG.links.map(([a, b]) => (
              <li key={a + b}>
                {a} <span aria-label="en lien avec">↔</span> {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Reveal>
  );
}
