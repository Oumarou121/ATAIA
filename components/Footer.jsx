import { SITE } from "@/lib/data";

export default function Footer() {
  return (
    <footer>
      <div className="foot-row">
        <div>
          <div className="foot-brand">{SITE.name}</div>
          <div>{SITE.tagline}</div>
        </div>
        <div className="foot-social">
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
      <div className="foot-copy">© {new Date().getFullYear()} {SITE.name} — {SITE.city}</div>
    </footer>
  );
}
