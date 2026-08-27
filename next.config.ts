import type { NextConfig } from "next";

/**
 * Sur GitHub Pages le site est servi depuis /<nom-du-repo>/.
 * En local la variable est vide, donc le site reste à la racine.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Export 100 % statique : GitHub Pages ne fait tourner aucun serveur.
  output: "export",
  basePath,
  // L'optimisation d'images a besoin d'un serveur ; les miniatures sont déjà
  // redimensionnées par ffmpeg (posters 640px, photos 1080px).
  images: { unoptimized: true },
  // /souvenirs -> /souvenirs/index.html, évite les 404 sur Pages.
  trailingSlash: true,
};

export default nextConfig;
