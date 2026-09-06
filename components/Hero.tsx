import SoftDivider from "./SoftDivider";
import { FRIEND, TAGLINE, SUN_HINT } from "@/app/data";

export default function Hero() {
  return (
    <section className="hero-letter">
      <nav className="chapter-nav" aria-label="Les chapitres">
        <a className="nav-monogram" href="#chapitre-un" aria-label="Commencer la lecture">a.</a>
        <div><a href="#lettre">La lettre</a><a href="#souvenirs">Souvenirs</a><a href="#grece">La Grèce</a></div>
        <span className="nav-dedication">juste pour toi</span>
      </nav>
      <div className="hero-orbit" aria-hidden="true" />
      <div className="hero-copy">
        <p className="entree hero-eyebrow">Une amitié, mille petites raisons</p>
        <p className="entree hero-handwriting">Il y a des personnes qui changent tout.</p>
        <h1 className="entree type-tendre-xl hero-name">{FRIEND}<span aria-hidden="true">.</span></h1>
        <div className="entree hero-divider"><SoftDivider /></div>
        <p className="entree hero-tagline">{TAGLINE}</p>
        <a className="entree reading-button" href="#chapitre-un">J’ai quelques mots pour toi <span aria-hidden="true">↗</span></a>
        <p className="hero-hint">{SUN_HINT}</p>
      </div>
      <div className="hero-bottom"><span>De nos éclats de rire aux rêves à venir</span><a href="#chapitre-un" aria-label="Descendre au premier chapitre">La suite est ici <span aria-hidden="true">↓</span></a></div>
    </section>
  );
}