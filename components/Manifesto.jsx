import { MANIFESTO } from "@/lib/data";
import Reveal from "./Reveal";

export default function Manifesto() {
  return (
    <Reveal as="section" className="manifesto" aria-label="Manifeste">
      <p>{MANIFESTO}</p>
    </Reveal>
  );
}
