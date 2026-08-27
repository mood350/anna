"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Point d'entrée unique de GSAP.
 *
 * `registerPlugin` doit être appelé une seule fois et jamais pendant le rendu
 * serveur — importer ce module depuis un composant client suffit à garantir les
 * deux. Tout le reste de la page passe par ici plutôt que d'importer GSAP
 * directement, pour qu'il n'y ait qu'un seul endroit à changer.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Vrai si la personne accepte le mouvement. Toutes les animations décoratives
 * sont enfermées derrière ce test.
 */
export function mouvementOk(): boolean {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, useGSAP };
