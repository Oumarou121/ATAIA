import Image from "next/image";
import { SITE } from "@/lib/data";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <Reveal as="footer">
      <div className="foot-row">
        <div>
          <div className="foot-brand">
            <Image className="brand-logo" src="/logo/ataia.png" alt={SITE.name} width={64} height={64} />
          </div>
          <div className="foot-full">{SITE.fullName}</div>
          <div>{SITE.tagline}</div>
        </div>
        <address className="foot-contact">
          <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
          <span className="foot-phones">
            {SITE.contact.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`}>{p.label}</a>
            ))}
          </span>
          <span>
            {SITE.contact.addressLines.join(", ")}
            <a
              className="foot-map"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.contact.mapsQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Itinéraire ↗
            </a>
          </span>
        </address>
        <div className="foot-social">
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
      <div className="foot-copy">© {new Date().getFullYear()} {SITE.name} — {SITE.city}</div>
    </Reveal>
  );
}
