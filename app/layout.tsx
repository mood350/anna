import type { Metadata } from "next";
import { Fraunces, Karla, Caveat } from "next/font/google";
import "./globals.css";
import { FRIEND } from "./data";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: FRIEND,
  description: `Une page rien que pour ${FRIEND} — ce que je ne lui dis jamais, écrit une bonne fois.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${karla.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        {/*
          Doit s'exécuter avant le premier rendu : si l'enveloppe a déjà été
          ouverte, l'attribut la masque en CSS et personne ne la voit clignoter.
          En cas de stockage refusé, on retombe sur « jamais vue », donc sur
          l'enveloppe — c'est le comportement le moins surprenant.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("anna:enveloppe")==="vue"){document.documentElement.dataset.enveloppe="vue"}}catch(e){}`,
          }}
        />
        {/*
          Sans JavaScript, GSAP ne lève jamais le voile sur les blocs qui
          attendent leur apparition, et l'enveloppe ne s'ouvre pas. La page
          resterait vide : ce filet la rend simplement lisible, sans animation.
        */}
        <noscript>
          <style>{`.invisible{visibility:visible!important}.enveloppe-gate{display:none!important}html{overflow:auto!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
