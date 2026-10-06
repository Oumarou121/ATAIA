import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Presentation from "@/components/Presentation";
import ProjectGrid from "@/components/ProjectGrid";
import Agency from "@/components/Agency";
import Manifesto from "@/components/Manifesto";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { LightboxProvider } from "@/components/Lightbox";

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
        <Agency />
        <Manifesto />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </LightboxProvider>
  );
}