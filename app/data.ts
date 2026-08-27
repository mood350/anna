/**
 * Tout ce qui est personnalisable est ici.
 * Modifie ce fichier pour changer les textes, les légendes ou l'ordre des
 * souvenirs. Aucun autre fichier n'a besoin d'être touché.
 */

export const FRIEND = "Anna";

/** Nom affiché en bas de la lettre. */
export const SIGNATURE = "ton meilleur ami";

/**
 * La musique de fond. Dépose ton fichier dans `public/audio/` et mets son
 * chemin ici. `null` = pas de musique et pas de bouton.
 */
export const SOUNDTRACK: string | null = "/audio/musique.mp3";

/** Sans ce mot, personne ne devine que le soleil de la page est un jeu. */
export const SUN_HINT = "(essaie d'attraper le soleil)";

/** Sous-titre de la page d'ouverture. */
export const TAGLINE =
  "Il y a des gens qu'on rencontre. Et puis il y a toi, que j'ai la chance de garder.";

/* ------------------------------------------------------------------ */
/* Chapitre un — le ton complice                                       */
/* ------------------------------------------------------------------ */

export const OPENING = [
  `Tu es fatigante. Tu parles trop, tu ris trop fort, et tu réponds à mes messages avant même que j'aie fini de les écrire. À trois heures du matin tu décroches encore, comme si l'heure ne te concernait pas.`,
  `Tu as des goûts de cinéma très discutables et des goûts culinaires encore pires. Tu es capable de défendre « À tous les garçons que j'ai aimés » pendant une heure entière, avec des arguments, et de mettre dans une même assiette des choses qui n'auraient jamais dû se rencontrer.`,
  `Et je ne changerais absolument rien.`,
];

/** Petit mot manuscrit sous le premier chapitre. */
export const ASIDE = "(sérieusement, tu dors quand ?)";

export type Trait = {
  title: string;
  body: string;
};

export const TRAITS: Trait[] = [
  {
    title: "Tu me fais rire",
    body: "Pas le rire poli. Le vrai, celui qui fait mal aux joues et qui arrive toujours au pire moment possible. Tu as ce talent-là et tu ne t'en rends même pas compte.",
  },
  {
    title: "Tu ne mens pas",
    body: "Tu me dis quand j'ai tort. Tu me le dis même quand je ne veux pas l'entendre — surtout quand je ne veux pas l'entendre. C'est rare, quelqu'un qui t'aime assez pour ça.",
  },
  {
    title: "Tu restes",
    body: "C'est le plus simple et le plus difficile. Les gens partent quand ça devient compliqué. Toi tu es toujours là, sans qu'on ait jamais eu besoin d'en parler.",
  },
];

/* ------------------------------------------------------------------ */
/* Chapitre trois — la lettre                                          */
/* ------------------------------------------------------------------ */

export const LETTER = [
  `On ne se dit pas ces choses-là, normalement. On se charrie, on parle de tout et de rien, et l'essentiel reste dessous sans qu'on y touche. Alors je l'écris, parce que c'est plus facile ainsi et parce que tu mérites de le lire au moins une fois.`,
  `Il y a eu des périodes où je n'allais pas bien et où je ne l'ai dit à personne. Toi, tu l'as vu quand même. Tu n'as pas fait de grand discours, tu n'as pas essayé de réparer. Tu es simplement restée dans la pièce. Je ne sais pas si tu mesures ce que ça vaut.`,
];

/** La phrase mise en exergue, au milieu de la lettre. */
export const PULL_QUOTE = "Je te fais confiance. Pas un peu. Complètement.";

export const LETTER_END = [
  `Ça veut dire que je peux te raconter ce dont je ne suis pas fier. Que je sais que ce que je te donne ne ressortira jamais ailleurs. Que quand tu me dis « ça va aller », je te crois — et je ne crois pas grand monde.`,
  `Cette confiance-là, personne ne me l'avait donnée avant toi. Tu ne l'as pas demandée non plus. Tu l'as juste méritée, jour après jour, sans jamais rien réclamer en échange.`,
];

/* ------------------------------------------------------------------ */
/* Chapitre quatre — les certitudes                                    */
/* ------------------------------------------------------------------ */

export type Certainty = {
  lead: string;
  body: string;
};

export const CERTAINTIES: Certainty[] = [
  {
    lead: "Que tu répondras.",
    body: "Toujours. Et toujours plus vite que je ne le mérite.",
  },
  {
    lead: "Que tu ne me jugeras pas.",
    body: "Même pour la version de moi que je cache aux autres.",
  },
  {
    lead: "Que tu me diras la vérité.",
    body: "Surtout celle qui ne fait pas plaisir.",
  },
  {
    lead: "Que tu es capable.",
    body: "Bien plus que tu ne le penses les jours où tu doutes.",
  },
  {
    lead: "Que le silence entre nous n'est pas un vide.",
    body: "On peut ne pas se parler pendant des semaines et reprendre au milieu de la phrase.",
  },
  {
    lead: "Que si un jour tout s'écroule, je saurai où aller.",
    body: "Et j'espère que tu sais que c'est réciproque.",
  },
];

/* ------------------------------------------------------------------ */
/* Chapitre cinq — la Grèce                                            */
/* ------------------------------------------------------------------ */

export const GREECE_INTRO = [
  `Tu en parles depuis tellement longtemps que je connais l'itinéraire par cœur. Les maisons blanches, les portes bleues, l'eau qu'on voit jusqu'au fond, et ce soleil qui met deux heures à se coucher.`,
  `Tu dis « un jour » à chaque fois. Moi je préfère dire quand.`,
];

export type Envie = {
  /** Doit correspondre à une icône de `GreekIcons.tsx`. */
  icon: "dome" | "wave" | "column" | "olive";
  title: string;
  body: string;
};

export const GREECE_WISHES: Envie[] = [
  {
    icon: "dome",
    title: "Les toits bleus",
    body: "Santorin au couchant, quand tout le village devient orange et que personne ne parle plus.",
  },
  {
    icon: "wave",
    title: "L'eau claire",
    body: "Celle où on voit ses pieds à trois mètres. Tu vas rester dedans jusqu'à ce que je vienne te chercher.",
  },
  {
    icon: "column",
    title: "Les vieilles pierres",
    body: "L'Acropole en fin de journée, quand la chaleur retombe. Tu liras tous les panneaux, je le sais déjà.",
  },
  {
    icon: "olive",
    title: "Manger dehors",
    body: "Une table qui bancale, des olives, du pain, et trois heures qui passent sans qu'on s'en aperçoive.",
  },
];

export const GREECE_PROMISE =
  "Alors garde de la place. Un jour, ce sera cette année-là.";

/* ------------------------------------------------------------------ */
/* Chapitre deux — les souvenirs                                       */
/* ------------------------------------------------------------------ */

export type Souvenir = {
  kind: "photo" | "video";
  /** Chemin dans public/ — toujours passé par `asset()` avant affichage. */
  src: string;
  /** Vignette : la photo elle-même, ou l'image extraite de la vidéo. */
  poster: string;
  caption: string;
  alt: string;
};

export const SOUVENIRS: Souvenir[] = [
  {
    kind: "photo",
    src: "/media/photo-01.jpg",
    poster: "/media/photo-01.jpg",
    caption: "Ce sourire-là. Voilà, c'est tout.",
    alt: "Anna souriante, avec ses lunettes",
  },
  {
    kind: "video",
    src: "/media/video-01.mp4",
    poster: "/posters/video-01.jpg",
    caption: "Toi, en entier.",
    alt: "Souvenir vidéo",
  },
  {
    kind: "video",
    src: "/media/video-02.mp4",
    poster: "/posters/video-02.jpg",
    caption: "Je regarde encore celle-ci.",
    alt: "Souvenir vidéo",
  },
  {
    kind: "video",
    src: "/media/video-03.mp4",
    poster: "/posters/video-03.jpg",
    caption: "Aucune raison. Juste toi.",
    alt: "Souvenir vidéo",
  },
  {
    kind: "photo",
    src: "/media/photo-02.jpg",
    poster: "/media/photo-02.jpg",
    caption: "Mademoiselle sérieuse.",
    alt: "Anna, le soir",
  },
  {
    kind: "video",
    src: "/media/video-04.mp4",
    poster: "/posters/video-04.jpg",
    caption: "Tu ne t'arrêtes jamais.",
    alt: "Souvenir vidéo",
  },
  {
    kind: "video",
    src: "/media/video-05.mp4",
    poster: "/posters/video-05.jpg",
    caption: "Là, tu es exactement toi.",
    alt: "Souvenir vidéo",
  },
  {
    kind: "photo",
    src: "/media/photo-03.jpg",
    poster: "/media/photo-03.jpg",
    caption: "Grande réflexion en cours.",
    alt: "Anna, la main sous le menton",
  },
  {
    kind: "video",
    src: "/media/video-06.mp4",
    poster: "/posters/video-06.jpg",
    caption: "Le genre de moment qu'on ne prépare pas.",
    alt: "Souvenir vidéo",
  },
  {
    kind: "video",
    src: "/media/video-07.mp4",
    poster: "/posters/video-07.jpg",
    caption: "Garde ça. C'est précieux.",
    alt: "Souvenir vidéo",
  },
  {
    kind: "video",
    src: "/media/video-08.mp4",
    poster: "/posters/video-08.jpg",
    caption: "Fin de la démonstration.",
    alt: "Souvenir vidéo",
  },
];
