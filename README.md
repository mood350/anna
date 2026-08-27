# Anna

Un site d'une seule page, en violet clair, pour dire à Anna ce qu'on ne se dit
jamais de vive voix. Next.js 16 + Tailwind v4, export 100 % statique.

## Lancer en local

```bash
npm install
npm run dev
```

Le site est sur http://localhost:3000.

## Modifier le contenu

**Tout le texte est dans `app/data.ts`.** C'est le seul fichier à toucher pour
changer les mots, les légendes ou l'ordre des souvenirs. Les composants lisent
ce fichier, rien n'est écrit en dur ailleurs.

| Ce que tu veux changer | Où |
| --- | --- |
| Le prénom, la signature, la phrase d'accroche | `FRIEND`, `SIGNATURE`, `TAGLINE` |
| Le chapitre un (le ton complice) | `OPENING`, `ASIDE`, `TRAITS` |
| La lettre | `LETTER`, `PULL_QUOTE`, `LETTER_END` |
| Les certitudes | `CERTAINTIES` |
| Le chapitre grec | `GREECE_INTRO`, `GREECE_WISHES`, `GREECE_PROMISE` |
| Les souvenirs et leurs légendes | `SOUVENIRS` |
| Les couleurs et les polices | `app/globals.css`, bloc `@theme` |

Les textes actuels sont une base — la lettre du chapitre trois gagne beaucoup à
être remplacée par de vrais souvenirs.

## Ajouter ou remplacer un souvenir

Les fichiers vivent dans `public/media` (photos et vidéos) et `public/posters`
(les vignettes des vidéos). Pour une nouvelle vidéo :

```bash
cp "ma-video.mp4" public/media/video-09.mp4
ffmpeg -ss 0.5 -i public/media/video-09.mp4 -frames:v 1 -vf "scale=640:-2" -q:v 4 public/posters/video-09.jpg
```

Puis ajoute l'entrée dans `SOUVENIRS` :

```ts
{
  kind: "video",
  src: "/media/video-09.mp4",
  poster: "/posters/video-09.jpg",
  caption: "Ta légende ici",
  alt: "Souvenir vidéo",
},
```

Pour une photo, `src` et `poster` pointent sur le même fichier et `kind` vaut
`"photo"`.

Le dossier `Media/` contient les fichiers WhatsApp d'origine ; il est ignoré par
git, tout ce qui compte est déjà copié dans `public/`.

## Le chapitre grec et le défilement

La scène de Santorin est dessinée en SVG, pas photographiée : elle reste nette à
toutes les tailles, pèse quelques kilo-octets, et ses couleurs sont celles du
site. Le couchant n'est pas un hasard — à cette heure-là le ciel de l'Égée est
violet et rose, donc la scène tient dans la palette au lieu de lui faire
concurrence. Le seul bleu franc est celui des dômes, parce que c'est lui qui dit
« Grèce ».

Elle est composée de quatre plans qui défilent à des vitesses différentes (0,03
pour le ciel, 0,17 pour la falaise) : c'est ce décalage qui donne la profondeur.
Le composant `Parallax` prend une vitesse et s'occupe du reste — il applique la
transformation sur un enfant, jamais sur l'élément mesuré, sinon la mesure
suivante serait faussée.

Deux effets de défilement ailleurs sur la page : le fil de progression en haut
(`ScrollProgress`), et les apparitions en fondu qui existaient déjà (`Reveal`).
Tout s'éteint si le système demande moins de mouvement.

Les illustrations vivent dans `GreekIcons.tsx` : le dôme, les vagues, la
colonne, la branche d'olivier, et le méandre — la frise en spirale carrée, faite
avec un `<pattern>` SVG qui s'éteint en fondu sur les bords.

## La musique de fond

Le fichier est `public/audio/musique.mp3`. L'original venait de `Media/` en
324 kbps avec une pochette embarquée (10 Mo) ; il a été réencodé en 112 kbps
sans métadonnées, ce qui le ramène à 3,4 Mo pour la même durée.

```bash
ffmpeg -i "ta-musique.mp3" -vn -map_metadata -1 -c:a libmp3lame -b:a 112k   public/audio/musique.mp3
```

Le chemin se règle dans `app/data.ts` :

```ts
export const SOUNDTRACK: string | null = "/audio/musique.mp3";
```

Mets `null` pour retirer la musique et son bouton d'un coup. Si le fichier est
absent ou illisible, le bouton disparaît tout seul plutôt que de rester mort.

Trois choses que le lecteur gère :

- **Le démarrage.** Les navigateurs refusent tout son tant que la personne n'a
  rien cliqué. L'ouverture de l'enveloppe est ce clic : la musique part au
  moment exact où la page apparaît. Pour un visiteur qui revient il n'y a pas
  d'enveloppe, donc on tente, et si le navigateur refuse, le bouton attend.
- **Le mélange.** Dès qu'un souvenir prend le son — son activé sur une carte, ou
  vue plein écran ouverte — la musique descend à 3 % puis remonte, au lieu de
  se superposer.
- **Le choix.** Le bouton en bas à droite coupe et remet la musique, et la
  préférence est retenue d'une visite à l'autre.

Le volume de croisière est à 14 % (`VOLUME` dans `Soundtrack.tsx`) : la musique
doit se sentir sans couvrir la lecture. Monte-le si tu la trouves trop discrète.

## Le paquet de souvenirs

Les souvenirs ne sont pas une grille : c'est une pile de cartes. On fait glisser
celle du dessus au doigt ou à la souris, et la suivante apparaît. Les flèches du
clavier et les deux boutons font la même chose, et le rang de points en dessous
donne un accès direct.

Seule la carte du dessus lit sa vidéo, en muet et en boucle ; les autres restent
sur leur vignette. Le bouton haut-parleur rend le son, celui à côté ouvre le
souvenir en plein écran, sans recadrage.

## L'enveloppe d'entrée

À la première visite, la page est masquée par une enveloppe qu'il faut ouvrir.
Une fois ouverte, le repère `anna:enveloppe` est écrit dans le `localStorage`
du navigateur : les visites suivantes vont directement à la page.

Pour revoir l'enveloppe pendant que tu travailles, ouvre la console du
navigateur et lance :

```js
localStorage.removeItem("anna:enveloppe"); location.reload();
```

Un onglet de navigation privée fait la même chose.

## Publier

### Envoyer le site tel quel

```bash
npm run build
```

L'export est dans `out/`. Compresse ce dossier et envoie-le — il s'ouvre en
double-cliquant sur `out/index.html`, sans serveur.

### GitHub Pages

`.github/workflows/deploy.yml` construit et publie à chaque push sur `main`.
Deux choses à régler avant :

1. Dans le workflow, remplace `NEXT_PUBLIC_BASE_PATH: /anna` par `/<nom-du-repo>`.
2. Dans les réglages du dépôt, **Pages → Source → GitHub Actions**.

Attention : les photos et les vidéos partent avec le site. Sur un dépôt public,
n'importe qui ayant l'URL peut les voir — mets le dépôt en privé, ou envoie
plutôt le dossier `out/` directement à Anna.

## Structure

```
app/
  data.ts        tout le contenu éditable
  layout.tsx     polices (Fraunces, Karla, Caveat) et métadonnées
  page.tsx       l'enchaînement des chapitres
  globals.css    palette violette, animations, styles partagés
components/
  EnvelopeGate.tsx     l'enveloppe à ouvrir, à la première visite
  Hero.tsx             l'ouverture plein écran
  PetalRain.tsx        la pluie de pétales violets en fond (canvas)
  Soundtrack.tsx       la musique de fond et son bouton
  GreeceScene.tsx      Santorin au couchant, en quatre plans
  GreekIcons.tsx       dôme, vagues, colonne, olivier, méandre
  Parallax.tsx         le décalage au défilement
  ScrollProgress.tsx   le fil de progression en haut de page
  SouvenirDeck.tsx     le paquet de souvenirs qu'on fait glisser
  SouvenirLightbox.tsx la vue plein écran d'un souvenir
  CertaintyList.tsx    la liste des certitudes
  ChapterTitle.tsx     l'en-tête commune aux chapitres
  HeartButton.tsx      le cœur à cliquer
  Reveal.tsx           l'apparition en fondu au défilement
  SoftDivider.tsx      le filet décoratif
lib/assets.ts    ajoute le basePath aux <video src> et <img src> bruts
```

Toutes les animations sont désactivées si le système demande moins de mouvement
(`prefers-reduced-motion`).
