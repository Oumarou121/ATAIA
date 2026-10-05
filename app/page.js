import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Presentation from "@/components/Presentation";
import ProjectGrid from "@/components/ProjectGrid";
import ProjectSection from "@/components/ProjectSection";
import VillasResidences from "@/components/VillasResidences";
import Agency from "@/components/Agency";
import Manifesto from "@/components/Manifesto";
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
        <Presentation />
        <ProjectGrid />
        {PROJECTS.map((p) => (
          <ProjectSection key={p.key} p={p} />
        ))}
        <VillasResidences />
        <Agency />
        <Manifesto />
        <Contact />
      </main>
      <Footer />
    </LightboxProvider>
  );
}
