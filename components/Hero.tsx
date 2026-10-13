import { FRIEND, TAGLINE, SUN_HINT } from "@/app/data";

/** Une carte postale méditerranéenne qui ouvre le récit. */
export default function Hero() {
  return (
    <section className="aegean-hero">
      <nav className="travel-nav" aria-label="Les chapitres">
        <a className="travel-mark" href="#chapitre-un" aria-label="Commencer la lecture">
          A<span>•</span>
        </a>
        <div className="travel-links">
          <a href="#lettre">La lettre</a>
          <a href="#souvenirs">Souvenirs</a>
          <a href="#grece">La Grèce</a>
        </div>
        <span className="travel-note">pour {FRIEND}, avec affection</span>
      </nav>

      <div className="postcard-shell">
        <div className="postcard-copy">
          <p className="entree postcard-kicker">Carnet d’une belle amitié</p>
          <p className="entree postcard-script">À celle qui décroche même à 3 h du matin,</p>
          <h1 className="entree postcard-title">
            Les jours<br />avec <em>toi.</em>
          </h1>
          <p className="entree postcard-tagline">{TAGLINE}</p>
          <a className="entree postcard-cta" href="#chapitre-un">
            Ouvrir le carnet <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="postcard-view" aria-hidden="true">
          <div className="postcard-stamp">GR<br /><strong>25</strong></div>
          <p className="postcard-place">Quelque part entre ici et la Grèce</p>
          <svg viewBox="0 0 620 720" role="presentation">
            <defs>
              <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1f4e68" />
                <stop offset=".58" stopColor="#698fa0" />
                <stop offset="1" stopColor="#efb590" />
              </linearGradient>
              <linearGradient id="heroSea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#326c87" />
                <stop offset="1" stopColor="#173f58" />
              </linearGradient>
            </defs>
            <rect width="620" height="720" rx="8" fill="url(#heroSky)" />
            <circle cx="425" cy="258" r="76" fill="#f6c274" opacity=".93" />
            <path d="M0 390 Q155 350 295 390 T620 370 V720 H0Z" fill="url(#heroSea)" />
            <path d="M0 468 Q122 400 238 452 T445 414 T620 438 V720 H0Z" fill="#f4eee2" />
            <g fill="#fffaf0">
              <rect x="84" y="390" width="132" height="128" rx="7" />
              <rect x="205" y="430" width="106" height="102" rx="5" />
              <rect x="335" y="382" width="155" height="162" rx="7" />
              <rect x="466" y="450" width="104" height="110" rx="5" />
            </g>
            <path d="M353 382 A59 59 0 0 1 471 382Z" fill="#285f9c" />
            <rect x="404" y="321" width="15" height="61" fill="#fffaf0" />
            <path d="M411 304v30M396 318h30" stroke="#fffaf0" strokeWidth="8" />
            <g fill="#285f9c">
              <rect x="116" y="444" width="38" height="74" rx="18 18 0 0" />
              <rect x="241" y="471" width="31" height="61" rx="15 15 0 0" />
              <rect x="387" y="465" width="45" height="79" rx="22 22 0 0" />
              <rect x="502" y="491" width="29" height="69" rx="14 14 0 0" />
            </g>
            <path d="M0 584 Q130 548 252 590 T620 565" fill="none" stroke="#f6c274" strokeWidth="6" opacity=".8" />
            <path d="M0 617 Q155 580 310 622 T620 595" fill="none" stroke="#fff" strokeWidth="3" opacity=".45" />
          </svg>
          <p className="postcard-caption">un jour, on verra ça pour de vrai</p>
        </div>
      </div>

      <div className="travel-footer">
        <span>{SUN_HINT}</span>
        <a href="#chapitre-un">Commencer l’histoire <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
