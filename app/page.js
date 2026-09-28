import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Explorer from "@/components/Explorer";
import ProjectIndex from "@/components/ProjectIndex";
import ProjectSection from "@/components/ProjectSection";
import VillasResidences from "@/components/VillasResidences";
import Agency from "@/components/Agency";
import Manifesto from "@/components/Manifesto";
import Domains from "@/components/Domains";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { LightboxProvider } from "@/components/Lightbox";
import { PROJECTS } from "@/lib/data";

export default function Home() {
  return (
    <LightboxProvider>
      <span id="top" />
      <a className="skip" href="#main">Aller au contenu principal</a>
      <Header />
      <main id="main">
        <Hero />
        <Intro />
        <Explorer />
        <ProjectIndex />
        {PROJECTS.map((p) => (
          <ProjectSection key={p.key} p={p} />
        ))}
        <VillasResidences />
        <Agency />
        <Manifesto />
        <Domains />
        <Contact />
      </main>
      <Footer />
    </LightboxProvider>
  );
}
