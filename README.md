# Anna

Un livre à feuilleter, en violet, pour dire à Anna ce qu'on ne se dit jamais de
vive voix. Next.js 16, export 100 % statique.

Le site s'ouvre sur une couverture de cuir violet frappée à l'or. On la touche,
le livre s'ouvre, et on tourne les pages : une page de texte, un souvenir (photo
ou vidéo), une page de texte, un souvenir… jusqu'à la quatrième de couverture.

## Lancer en local

```bash
npm install
npm run dev
```

Le site est sur http://localhost:3000.

## Tourner les pages

- **Au doigt ou à la souris** : on attrape la page et on la fait glisser, elle
  suit le geste. Relâchée avant le tiers, elle retombe ; au-delà, elle tourne.
- **En touchant le bord** : sur téléphone, toucher la page à droite avance, à
  gauche recule. Sur grand écran, ce sont les bords extérieurs du livre.
- **Les flèches** en bas de l'écran, celles du clavier, ou la molette.
- **Le sommaire** (en haut à gauche) ramène à la table des matières, dont
  chaque ligne mène directement au chapitre — les pages défilent en éventail.

Sur un écran large en paysage, le livre s'ouvre en double page. Sur téléphone
(ou tablette en portrait), il montre une page à la fois. On peut tourner le
téléphone en cours de lecture : on reste à la même page.

## Modifier le contenu

**Tout le texte est dans `app/data.ts`.** C'est le seul fichier à toucher pour
changer les mots, les légendes ou l'ordre des souvenirs.

| Ce que tu veux changer | Où |
| --- | --- |
| Le prénom, la signature, la phrase de la page de titre | `FRIEND`, `SIGNATURE`, `TAGLINE` |
| La couverture | `COVER_SUBTITLE`, `COVER_FOOT` |
| Les titres des chapitres | `CHAPITRES` |
| Chapitre un (le ton complice) | `OPENING`, `ASIDE`, `TRAITS` |
| Chapitre deux (la lettre) | `LETTER`, `PULL_QUOTE`, `LETTER_END`, `LETTER_SIGNOFF` |
| Chapitre trois (les certitudes) | `CERTAINTIES` |
| Chapitre quatre (la Grèce) | `GREECE_INTRO`, `GREECE_WISHES`, `GREECE_PROMISE` |
| Les souvenirs et leurs légendes | `SOUVENIRS` |
| Les dernières pages | `CLOSING_*`, `COLOPHON`, `BLANK_PAGE` |
| Les couleurs et les polices | `app/globals.css` (bloc `:root`) et `app/layout.tsx` |

La mise en pages est automatique (`app/book.ts`) :

- chaque paragraphe a sa page ; une phrase courte (moins de 90 signes) a droit
  à une page à elle seule, en grand ;
- chaque qualité de `TRAITS` a sa page, les certitudes vont par trois, les
  envies grecques par deux ;
- les souvenirs sont répartis régulièrement entre les pages de texte, dans
  l'ordre de `SOUVENIRS` ;
- si le livre a un nombre de pages impair, une page blanche s'ajoute avant la
  fin pour que la quatrième de couverture tombe au bon endroit.

Ajouter un paragraphe, un souvenir ou une certitude ajoute donc les pages
qu'il faut, et le sommaire se met à jour tout seul.

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

Sur sa page, le souvenir est collé avec quatre coins photo violets et sa
légende écrite à la main. Le cadre prend la forme exacte de l'image (portrait,
carré ou paysage) : rien n'est recadré. Une vidéo ne joue que lorsque sa page
est ouverte, en muet et en boucle ; le haut-parleur lui rend le son, et le
bouton à côté (ou un toucher sur l'image) ouvre le souvenir en plein écran.

Le dossier `Media/` contient les fichiers WhatsApp d'origine ; il est ignoré par
git, tout ce qui compte est déjà copié dans `public/`.

## La musique de fond

Le fichier est `public/audio/musique.mp3`, et son chemin se règle dans
`app/data.ts` :

```ts
export const SOUNDTRACK: string | null = "/audio/musique.mp3";
```

Mets `null` pour retirer la musique et son bouton d'un coup.

- **Le démarrage.** Les navigateurs refusent tout son tant qu'on n'a rien
  touché : c'est l'ouverture de la couverture qui lance la musique.
- **Le mélange.** Quand une vidéo prend le son, ou qu'un souvenir est ouvert en
  plein écran, la musique descend presque à zéro puis remonte ensuite.
- **Le choix.** Le bouton note de musique, en haut à droite, coupe et remet la
  musique ; la préférence est retenue d'une visite à l'autre.
- **Le volume** (16 %, `VOLUME` dans `components/book/music.ts`) passe par Web
  Audio : sur iPhone, c'est la seule façon de le régler.

## Publier

### Envoyer le site tel quel

```bash
npm run build
```

L'export est dans `out/`. Compresse ce dossier et envoie-le.

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
  book.ts        range le contenu en pages et glisse les souvenirs entre elles
  layout.tsx     polices (Cormorant Garamond, EB Garamond, Pinyon Script, Caveat)
  page.tsx       affiche le livre
  globals.css    le cuir, le papier, la typographie, les animations
components/book/
  Book.tsx         le livre : feuilles, geste du doigt, clavier, barres
  PageFace.tsx     le contenu de chaque sorte de page
  MediaPage.tsx    une page souvenir (photo ou vidéo)
  Lightbox.tsx     un souvenir en plein écran
  HeartButton.tsx  le cœur à toucher, à la fin
  Ornaments.tsx    la violette, les fleurons, les icônes, Santorin
  music.ts         la musique de fond
lib/assets.ts    ajoute le basePath aux <video src> et <img src> bruts
```

L'ancien design (la page qui défilait) est rangé dans `_ancien-design/` ; ses
composants sont restés dans `components/`, mais plus rien ne les utilise.

Toutes les animations sont coupées si le système demande moins de mouvement
(`prefers-reduced-motion`) : les pages tournent alors instantanément.
