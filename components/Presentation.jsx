import { PRESENTATION } from "@/lib/data";
import Reveal from "./Reveal";

const pad2 = (n) => String(n).padStart(2, "0");

/** Présentation de l'agence, juste après l'introduction du hero. Données : PRESENTATION dans lib/data.js. */
export default function Presentation() {
  return (
    <section className="pres" id="presentation" aria-label="Présentation de l'agence">
      <Reveal className="pres-head">
        <span className="idx">+</span>
        <p className="pres-lead">{PRESENTATION.lead}</p>
      </Reveal>

      <div className="pres-cols">
        {PRESENTATION.blocks.map((b, i) => (
          <Reveal key={b.title} className="pres-block">
            <span className="pres-kicker">
              <b>{pad2(i + 1)}</b> {b.kicker}
            </span>
            <h2 className="pres-title">{b.title}</h2>
            <p className="pres-text">{b.text}</p>
            <ul className="pres-list">
              {b.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
