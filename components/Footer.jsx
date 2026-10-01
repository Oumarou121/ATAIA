import { SITE } from "@/lib/data";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <Reveal as="footer">
      <div className="foot-row">
        <div>
          <div className="foot-brand">{SITE.name}</div>
          <div>{SITE.tagline}</div>
        </div>
        <address className="foot-contact">
          <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
          <span className="foot-phones">
            {SITE.contact.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`}>{p.label}</a>
            ))}
          </span>
          <span>{SITE.contact.addressLines.join(", ")}</span>
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
