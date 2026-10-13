"use client";

import type { Souvenir } from "@/app/data";
import {
  FRIEND,
  TAGLINE,
  COVER_SUBTITLE,
  COVER_FOOT,
  BLANK_PAGE,
  CLOSING_EYEBROW,
  CLOSING_WORD,
  CLOSING_TEXT,
  COLOPHON,
  SIGNATURE,
} from "@/app/data";
import { CONTENTS, type Page } from "@/app/book";
import MediaPage from "./MediaPage";
import HeartButton from "./HeartButton";
import { Corner, Fleuron, GreeceVignette, Violet, WISH_ICONS } from "./Ornaments";

export type FaceProps = {
  page: Page;
  /** Monté seulement près de la page ouverte, pour ne pas charger 11 vidéos. */
  near: boolean;
  active: boolean;
  onGo: (pageIndex: number) => void;
  onZoom: (s: Souvenir) => void;
  onRestart: () => void;
};

const NOMBRES = ["Un", "Deux", "Trois", "Quatre", "Cinq", "Six", "Sept", "Huit", "Neuf"];

function Cover() {
  return (
    <div className="cover">
      <div className="cover-frame" aria-hidden="true">
        <Corner className="cover-corner k-tl" />
        <Corner className="cover-corner k-tr" />
        <Corner className="cover-corner k-bl" />
        <Corner className="cover-corner k-br" />
      </div>
      <div className="cover-body">
        <Violet className="cover-violet" />
        <h1 className="cover-title foil">{FRIEND}</h1>
        <Fleuron className="cover-fleuron" />
        <p className="cover-sub">{COVER_SUBTITLE}</p>
      </div>
      <p className="cover-foot">{COVER_FOOT}</p>
    </div>
  );
}

function BackCover({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="cover cover-back">
      <div className="cover-frame" aria-hidden="true">
        <Corner className="cover-corner k-tl" />
        <Corner className="cover-corner k-tr" />
        <Corner className="cover-corner k-bl" />
        <Corner className="cover-corner k-br" />
      </div>
      <div className="cover-body">
        <Violet className="cover-violet small" />
        <p className="back-word foil">{CLOSING_WORD}</p>
        <p className="cover-sub">Pour {FRIEND}, de la part de {SIGNATURE}</p>
        <button type="button" className="back-restart" onClick={onRestart}>
          Relire depuis le début
        </button>
      </div>
    </div>
  );
}

function Endpaper({ end }: { end: "front" | "back" }) {
  return (
    <div className="endpaper">
      {end === "front" && (
        <div className="exlibris">
          <Violet className="exlibris-violet" />
          <p className="exlibris-label">Ex libris</p>
          <p className="exlibris-name">{FRIEND}</p>
        </div>
      )}
    </div>
  );
}

function TitlePage() {
  return (
    <div className="page page-title">
      <p className="eyebrow">Un livre pour</p>
      <h2 className="title-name">{FRIEND}</h2>
      <Fleuron className="fleuron" />
      <p className="title-tagline">{TAGLINE}</p>
    </div>
  );
}

function Contents({ onGo }: { onGo: (i: number) => void }) {
  return (
    <div className="page page-contents">
      <h2 className="contents-title">Sommaire</h2>
      <Fleuron className="fleuron" />
      <ol className="contents-list">
        {CONTENTS.map((entry) => (
          <li key={entry.page}>
            <button type="button" className="contents-row" onClick={() => onGo(entry.page)}>
              <span className="contents-label">{entry.label}</span>
              <span className="contents-name">
                {entry.title && <>{entry.title} </>}
                <em>{entry.accent}</em>
              </span>
              <span className="contents-dots" aria-hidden="true" />
              <span className="contents-page">{entry.page - 1}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Body({ page, active, onGo, onZoom, onRestart }: FaceProps) {
  switch (page.kind) {
    case "cover":
      return <Cover />;
    case "backcover":
      return <BackCover onRestart={onRestart} />;
    case "endpaper":
      return <Endpaper end={page.end} />;
    case "title":
      return <TitlePage />;
    case "contents":
      return <Contents onGo={onGo} />;

    case "chapter":
      return (
        <div className={`page page-chapter${page.key === "grece" ? " has-vignette" : ""}`}>
          <Violet className="chapter-watermark" />
          <p className="chapter-roman">{page.roman}</p>
          <p className="eyebrow">{page.chapitre.numero}</p>
          <h2 className="chapter-title">
            {page.chapitre.avant} <em>{page.chapitre.accent}</em>
          </h2>
          <Fleuron className="fleuron" />
          {page.key === "grece" && <GreeceVignette className="vignette" />}
          {page.chapitre.chapeau && <p className="chapter-lead">{page.chapitre.chapeau}</p>}
        </div>
      );

    case "prose":
      return (
        <div className={`page page-prose${page.centered ? " is-centered" : ""}`}>
          <Runhead text={page.running} />
          <div className="page-body">
            {page.salutation && <p className="salutation">{page.salutation}</p>}
            <div className={`prose${page.dropCap ? " has-dropcap" : ""}`}>
              {page.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {page.aside && <p className="aside">{page.aside}</p>}
            {page.signoff && (
              <p className="signoff">
                {page.signoff.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            )}
          </div>
        </div>
      );

    case "statement":
      return (
        <div className="page page-statement">
          <Runhead text={page.running} />
          <div className="page-body">
            <p className="statement">{page.text}</p>
            {page.aside && <p className="aside">{page.aside}</p>}
          </div>
        </div>
      );

    case "trait":
      return (
        <div className="page page-trait">
          <Runhead text={page.running} />
          <div className="page-body">
            <p className="trait-count">
              {NOMBRES[page.n - 1] ?? page.n} <span>/ {page.total}</span>
            </p>
            <h3 className="trait-title">{page.trait.title}</h3>
            <Fleuron className="fleuron small" />
            <p className="trait-body">{page.trait.body}</p>
          </div>
          <Violet className="trait-violet" />
        </div>
      );

    case "quote":
      return (
        <div className="page page-quote">
          <Runhead text={page.running} />
          <div className="page-body">
            <span className="quote-mark" aria-hidden="true">
              «
            </span>
            <blockquote className="quote">{page.text}</blockquote>
          </div>
        </div>
      );

    case "certainties":
      return (
        <div className="page page-list">
          <Runhead text={page.running} />
          <div className="page-body">
            <ol className="certainties" start={page.start + 1}>
              {page.items.map((c, i) => (
                <li key={c.lead}>
                  <span className="cert-num">{page.start + i + 1}</span>
                  <p className="cert-lead">{c.lead}</p>
                  <p className="cert-body">{c.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      );

    case "wishes":
      return (
        <div className="page page-list">
          <Runhead text={page.running} />
          <div className="page-body">
            <ul className="wishes">
              {page.items.map((w) => {
                const Icon = WISH_ICONS[w.icon];
                return (
                  <li key={w.title}>
                    <Icon className="wish-icon" />
                    <div>
                      <h3 className="wish-title">{w.title}</h3>
                      <p className="wish-body">{w.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );

    case "promise":
      return (
        <div className="page page-statement">
          <Runhead text={page.running} />
          <div className="page-body">
            <Fleuron className="fleuron small" />
            <p className="promise">{page.text}</p>
            <Fleuron className="fleuron small" />
          </div>
        </div>
      );

    case "media":
      return (
        <MediaPage
          souvenir={page.souvenir}
          n={page.n}
          total={page.total}
          active={active}
          onZoom={onZoom}
        />
      );

    case "blank":
      return (
        <div className="page page-blank">
          <p className="blank-note">{BLANK_PAGE}</p>
        </div>
      );

    case "closing":
      return (
        <div className="page page-closing">
          <p className="eyebrow">{CLOSING_EYEBROW}</p>
          <p className="closing-word">{CLOSING_WORD}</p>
          <p className="closing-text">{CLOSING_TEXT}</p>
          <HeartButton />
        </div>
      );

    case "colophon":
      return (
        <div className="page page-colophon">
          <Violet className="colophon-violet" />
          <p className="eyebrow">Achevé d&rsquo;écrire</p>
          {COLOPHON.map((line) => (
            <p key={line} className="colophon-line">
              {line}
            </p>
          ))}
          <p className="colophon-sign">Pour {FRIEND}</p>
        </div>
      );
  }
}

function Runhead({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <header className="runhead">
      <span>{text}</span>
    </header>
  );
}

/** Ce qui ne porte pas de papier : couvertures et pages de garde. */
export function isBoard(page: Page) {
  return page.kind === "cover" || page.kind === "backcover" || page.kind === "endpaper";
}

export default function PageFace(props: FaceProps) {
  const { page, near } = props;
  const keepAlways = isBoard(page);
  return (
    <>
      {(near || keepAlways) && <Body {...props} />}
      {near && page.folio !== undefined && page.kind !== "title" && (
        <span className="folio" aria-hidden="true">
          {page.folio}
        </span>
      )}
    </>
  );
}
