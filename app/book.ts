/**
 * L'ordre des pages du livre.
 *
 * Rien à modifier ici pour changer un texte : tout vient de `data.ts`. Ce
 * fichier ne fait que ranger le contenu en pages, puis glisser les souvenirs
 * (photos et vidéos) entre les pages de texte, à intervalles réguliers, pour
 * que le livre alterne d'un bout à l'autre : une page, un souvenir, une page…
 */

import {
  FRIEND,
  SIGNATURE,
  OPENING,
  ASIDE,
  TRAITS,
  LETTER,
  PULL_QUOTE,
  LETTER_END,
  LETTER_SIGNOFF,
  CERTAINTIES,
  GREECE_INTRO,
  GREECE_WISHES,
  GREECE_PROMISE,
  SOUVENIRS,
  CHAPITRES,
  CLOSING_WORD,
  type Chapitre,
  type Certainty,
  type Envie,
  type Souvenir,
  type Trait,
} from "./data";

export type ChapterKey = keyof typeof CHAPITRES;

export type PageData =
  | { kind: "cover" }
  | { kind: "endpaper"; end: "front" | "back" }
  | { kind: "title" }
  | { kind: "contents" }
  | { kind: "chapter"; key: ChapterKey; roman: string; chapitre: Chapitre }
  | {
      kind: "prose";
      paragraphs: string[];
      dropCap?: boolean;
      salutation?: string;
      aside?: string;
      signoff?: string[];
      centered?: boolean;
    }
  | { kind: "statement"; text: string; aside?: string }
  | { kind: "trait"; trait: Trait; n: number; total: number }
  | { kind: "quote"; text: string }
  | { kind: "certainties"; items: Certainty[]; start: number }
  | { kind: "wishes"; items: Envie[] }
  | { kind: "promise"; text: string }
  | { kind: "media"; souvenir: Souvenir; n: number; total: number }
  | { kind: "blank" }
  | { kind: "closing" }
  | { kind: "colophon" }
  | { kind: "backcover" };

export type Page = PageData & {
  /** Titre courant affiché en haut des pages. */
  running?: string;
  /** Numéro imprimé en bas de page. */
  folio?: number;
};

const ROMAINS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

/** Une phrase courte mérite une page à elle seule, en grand. */
const COURT = 90;

function chapterPages(key: ChapterKey, index: number): PageData[] {
  const head: PageData = {
    kind: "chapter",
    key,
    roman: ROMAINS[index] ?? String(index + 1),
    chapitre: CHAPITRES[key],
  };

  switch (key) {
    case "honnetes": {
      const prose: PageData[] = OPENING.map((p, i) => {
        const last = i === OPENING.length - 1;
        if (p.length < COURT) return { kind: "statement", text: p, aside: last ? ASIDE : undefined };
        return { kind: "prose", paragraphs: [p], dropCap: i === 0, aside: last ? ASIDE : undefined };
      });
      const traits: PageData[] = TRAITS.map((trait, i) => ({
        kind: "trait",
        trait,
        n: i + 1,
        total: TRAITS.length,
      }));
      return [head, ...prose, ...traits];
    }

    case "lettre": {
      const debut: PageData[] = LETTER.map((p, i) => ({
        kind: "prose",
        paragraphs: [p],
        salutation: i === 0 ? `${FRIEND},` : undefined,
      }));
      const fin: PageData[] = LETTER_END.map((p, i) => ({
        kind: "prose",
        paragraphs: [p],
        signoff: i === LETTER_END.length - 1 ? [LETTER_SIGNOFF, `— ${SIGNATURE}`] : undefined,
      }));
      return [head, ...debut, { kind: "quote", text: PULL_QUOTE }, ...fin];
    }

    case "certitudes":
      return [
        head,
        ...chunk(CERTAINTIES, 3).map(
          (items, i): PageData => ({ kind: "certainties", items, start: i * 3 }),
        ),
      ];

    case "grece":
      return [
        head,
        { kind: "prose", paragraphs: GREECE_INTRO, centered: true },
        ...chunk(GREECE_WISHES, 2).map((items): PageData => ({ kind: "wishes", items })),
        { kind: "promise", text: GREECE_PROMISE },
      ];
  }
}

function runningTitle(c: Chapitre) {
  return `${c.avant} ${c.accent}`.replace(/,$/, "");
}

function build(): Page[] {
  const keys = Object.keys(CHAPITRES) as ChapterKey[];

  /* Les pages de texte, chapitre après chapitre, avec leur titre courant. */
  const body: Page[] = keys.flatMap((key, i) =>
    chapterPages(key, i).map((p) => ({ ...p, running: runningTitle(CHAPITRES[key]) })),
  );

  /*
   * Les souvenirs sont répartis régulièrement : le k-ième se place après la
   * page de texte n° round((k + 1) × T / (M + 1)). Jamais avant la première
   * page de texte, et s'il y a plus de souvenirs que de pages, ils se suivent.
   */
  const T = body.length;
  const M = SOUVENIRS.length;
  const slots = SOUVENIRS.map((_, k) => Math.max(1, Math.round(((k + 1) * T) / (M + 1))));

  const woven: Page[] = [];
  body.forEach((page, i) => {
    woven.push(page);
    SOUVENIRS.forEach((souvenir, k) => {
      if (slots[k] === i + 1) {
        woven.push({ kind: "media", souvenir, n: k + 1, total: M, running: page.running });
      }
    });
  });

  const front: Page[] = [
    { kind: "cover" },
    { kind: "endpaper", end: "front" },
    { kind: "title" },
    { kind: "contents" },
  ];

  const ending: Page[] = [{ kind: "closing" }, { kind: "colophon" }];

  /*
   * Sur grand écran, le livre s'ouvre en double page : la quatrième de
   * couverture doit tomber au dos de la dernière feuille, donc le total doit
   * être pair. Si ce n'est pas le cas, une page blanche s'ajoute avant la fin.
   */
  const total = front.length + woven.length + ending.length + 2;
  const filler: Page[] = total % 2 === 0 ? [] : [{ kind: "blank" }];

  const pages: Page[] = [
    ...front,
    ...woven,
    ...filler,
    ...ending,
    { kind: "endpaper", end: "back" },
    { kind: "backcover" },
  ];

  /* Les numéros de page commencent à la page de titre. */
  return pages.map((p, i) =>
    p.kind === "cover" || p.kind === "endpaper" || p.kind === "backcover"
      ? p
      : { ...p, folio: i - 1 },
  );
}

export const PAGES: Page[] = build();

export type ContentsEntry = { label: string; title: string; accent: string; page: number };

/** Le sommaire, avec l'index réel de chaque page dans le livre. */
export const CONTENTS: ContentsEntry[] = [
  ...PAGES.flatMap((p, i): ContentsEntry[] =>
    p.kind === "chapter"
      ? [{ label: p.chapitre.numero, title: p.chapitre.avant, accent: p.chapitre.accent, page: i }]
      : [],
  ),
  ...PAGES.flatMap((p, i): ContentsEntry[] =>
    p.kind === "closing" ? [{ label: "Pour finir", title: "", accent: CLOSING_WORD.replace(/\.$/, ""), page: i }] : [],
  ),
];

/** Le titre courant d'une page, pour la barre du haut. */
export function runningFor(index: number): string {
  const p = PAGES[index];
  if (!p) return "";
  if (p.kind === "cover" || p.kind === "backcover") return "";
  if (p.kind === "closing" || p.kind === "colophon" || p.kind === "blank") return "Pour finir";
  if (p.kind === "contents") return "Sommaire";
  if (p.kind === "title" || p.kind === "endpaper") return "";
  return p.running ?? "";
}
