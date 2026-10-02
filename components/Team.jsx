import { TEAM } from "@/lib/data";
import Reveal from "./Reveal";

const pad2 = (n) => String(n).padStart(2, "0");

/** Bloc « Équipe et moyens » : ressources humaines (disciplines, réseau d'experts) et moyens logistiques. Données : TEAM dans lib/data.js. */
export default function Team() {
  return (
    <div className="team">
      <Reveal className="team-head">
        <h3 className="team-title">{TEAM.title}</h3>
        <p className="team-intro">{TEAM.intro}</p>
      </Reveal>

      <div className="team-cols">
        <Reveal className="team-col">
          <h4 className="team-sub">Disciplines</h4>
          <ul className="team-pills">
            {TEAM.disciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="team-col">
          <h4 className="team-sub">Réseau d&apos;experts</h4>
          <p className="team-note">{TEAM.networkText}</p>
          <ul className="team-pills">
            {TEAM.network.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="team-means-head">
        <h4 className="team-sub">Moyens logistiques</h4>
        <p className="team-note">{TEAM.meansText}</p>
      </Reveal>
      <Reveal as="ul" stagger className="team-means" threshold={0.1}>
        {TEAM.means.map((m, i) => (
          <li key={m} className="team-card">
            <span className="team-no">{pad2(i + 1)}</span>
            <span className="team-name">{m}</span>
          </li>
        ))}
      </Reveal>
    </div>
  );
}
