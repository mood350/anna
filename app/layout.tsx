import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, EB_Garamond, Pinyon_Script, Caveat } from "next/font/google";
import "./globals.css";
import { FRIEND } from "./data";

/** Les titres : un Garamond de titrage, très fin, superbe en italique. */
const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

/** Le texte courant : un Garamond de livre, fait pour être lu longtemps. */
const body = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

/** La signature dorée de la couverture et le « Toujours » de la fin. */
const script = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

/** Les légendes écrites à la main sous les souvenirs. */
const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${FRIEND} — un livre`,
  description: `Un livre à feuilleter, rien que pour ${FRIEND}.`,
};

export const viewport: Viewport = {
  themeColor: "#1b0a33",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} ${script.variable} ${hand.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
