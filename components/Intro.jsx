import { INTRO } from "@/lib/data";
import Reveal from "./Reveal";

export default function Intro() {
  return (
    <Reveal as="section" className="intro" id="intro" aria-label="Introduction">
      {INTRO.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </Reveal>
  );
}
