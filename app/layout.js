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
    images: [{ url: "/images/bceao-tahoua/0.jpg" }],
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
      <body>{children}</body>
    </html>
  );
}
