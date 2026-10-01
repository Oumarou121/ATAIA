import "./globals.css";
import { Fraunces, Inter } from "next/font/google";
import { SITE } from "@/lib/data";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: `${SITE.name} — Architecture, urbanisme & ingénierie à Niamey`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — Architecture, urbanisme & ingénierie`,
    description: SITE.description,
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/images/bceao-tahoua/0.png" }],
  },
};

// Données structurées (référencement local) : nom, téléphones, e-mail et adresse viennent de SITE.contact.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  alternateName: SITE.fullName,
  description: SITE.description,
  ...(process.env.NEXT_PUBLIC_SITE_URL ? { url: process.env.NEXT_PUBLIC_SITE_URL } : {}),
  telephone: SITE.contact.phones.map((p) => p.tel),
  email: SITE.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.contact.addressLines[0].replace(" — ", ", "),
    addressLocality: "Niamey",
    addressCountry: "NE",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('rv-on');}",
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}