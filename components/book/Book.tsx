"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PAGES, runningFor, type Page } from "@/app/book";
import { FRIEND, SOUNDTRACK, type Souvenir } from "@/app/data";
import { asset } from "@/lib/assets";
import PageFace from "./PageFace";
import Lightbox from "./Lightbox";
import { music } from "./music";
import { ChevronLeft, ChevronRight, ListIcon, NoteIcon } from "./Ornaments";

/**
 * Le livre.
 *
 * Il est fait de feuilles (`leaf`) empilées sur la reliure. Chaque feuille a un
 * recto et un verso ; tourner une page, c'est faire pivoter une feuille de
 * 180° autour de la reliure.
 *
 * - Sur grand écran en paysage, le livre s'ouvre en double page : une feuille
 *   porte deux pages (recto à droite, verso à gauche une fois tournée).
 * - Sur téléphone, une seule page à la fois : chaque page est une feuille, et
 *   la page tournée part vers la gauche puis s'efface.
 *
 * On tourne en glissant du doigt (la page suit le doigt), en touchant le bord
 * de la page, avec les flèches du bas, celles du clavier ou la molette.
 */

type Mode = "spread" | "single";
type Layout = { mode: Mode; pw: number; ph: number };
type Moving = Record<number, { delay: number; forward: boolean; token: number }>;

const TURN_MS = 950;
const P = PAGES.length;
const CONTENTS_PAGE = Math.max(0, PAGES.findIndex((p) => p.kind === "contents"));

const leafCount = (mode: Mode) => (mode === "spread" ? Math.ceil(P / 2) : P);
const maxTurned = (mode: Mode) => (mode === "spread" ? leafCount(mode) : P - 1);
const pageToTurned = (page: number, mode: Mode) => (mode === "spread" ? Math.ceil(page / 2) : page);
const turnedToPage = (t: number, mode: Mode) =>
  mode === "spread" ? (t === 0 ? 0 : Math.min(2 * t - 1, P - 1)) : t;

function visiblePages(t: number, mode: Mode): number[] {
  if (mode === "single") return [t];
  return [2 * t - 1, 2 * t].filter((p) => p >= 0 && p < P);
}

function leafPages(i: number, mode: Mode): [number, number | null] {
  if (mode === "single") return [i, null];
  const back = 2 * i + 1;
  return [2 * i, back < P ? back : null];
}

function computeLayout(): Layout {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const chrome = vw < 640 ? 122 : 156;
  const availH = Math.max(260, vh - chrome);

  if (vw >= 880 && vw / vh >= 1.12) {
    let ph = Math.min(availH, 900);
    let pw = ph * 0.7;
    const maxPw = (vw - 120) / 2;
    if (pw > maxPw) {
      pw = maxPw;
      ph = pw / 0.7;
    }
    return { mode: "spread", pw: Math.round(pw), ph: Math.round(ph) };
  }

  let pw = Math.min(vw - 28, 540);
  const ph = Math.min(availH, pw * 1.72);
  if (ph < pw * 1.3) pw = ph / 1.3;
  return { mode: "single", pw: Math.round(pw), ph: Math.round(ph) };
}

function faceClass(page: Page | undefined) {
  if (!page) return "paper";
  if (page.kind === "cover" || page.kind === "backcover") return "board";
  if (page.kind === "endpaper") return "endpaper-face";
  return "paper";
}

export default function Book() {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [turned, setTurned] = useState(0);
  const [moving, setMoving] = useState<Moving>({});
  const [lightbox, setLightbox] = useState<Souvenir | null>(null);
  const [playing, setPlaying] = useState(false);
  const [userTurns, setUserTurns] = useState(0);
  const [dragging, setDragging] = useState<number | null>(null);

  const layoutRef = useRef<Layout | null>(null);
  const turnedRef = useRef(0);
  const lightboxRef = useRef(false);
  const stageRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);
  const token = useRef(0);
  const justDragged = useRef(false);
  const drag = useRef<{
    id: number;
    x0: number;
    y0: number;
    t0: number;
    lastX: number;
    lastT: number;
    active: boolean;
    dir: 1 | -1;
    leaf: number;
    progress: number;
  } | null>(null);

  useEffect(() => {
    lightboxRef.current = lightbox !== null;
  }, [lightbox]);

  /* ---------------------------- mise en page ---------------------------- */

  useEffect(() => {
    const apply = () => {
      const next = computeLayout();
      const prev = layoutRef.current;
      layoutRef.current = next;
      if (prev && prev.mode !== next.mode) {
        const page = turnedToPage(turnedRef.current, prev.mode);
        const t = Math.min(pageToTurned(page, next.mode), maxTurned(next.mode));
        turnedRef.current = t;
        setTurned(t);
        setMoving({});
      }
      setLayout(next);
    };
    apply();
    window.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("resize", apply);
      window.visualViewport?.removeEventListener("resize", apply);
    };
  }, []);

  /* ------------------------------ musique ------------------------------- */

  useEffect(() => {
    music.setSource(SOUNDTRACK ? asset(SOUNDTRACK) : null);
    return music.subscribe(setPlaying);
  }, []);

  /* ------------------------------ tourner ------------------------------- */

  const go = useCallback((target: number) => {
    const mode = layoutRef.current?.mode;
    if (!mode) return;
    const from = turnedRef.current;
    const to = Math.max(0, Math.min(maxTurned(mode), target));
    if (to === from) return;

    // Le premier geste ouvre le livre : c'est le moment de lancer la musique.
    music.start();

    const forward = to > from;
    const lo = Math.min(from, to);
    const hi = Math.max(from, to);
    const span = hi - lo;
    // Un saut de plusieurs pages (le sommaire) les fait défiler en éventail.
    const stagger = span > 1 ? Math.min(55, 700 / span) : 0;
    const tk = ++token.current;
    const entries: Moving = {};
    for (let i = lo; i < hi; i++) {
      const order = forward ? i - lo : hi - 1 - i;
      entries[i] = { delay: Math.round(order * stagger), forward, token: tk };
    }

    turnedRef.current = to;
    setTurned(to);
    setMoving((m) => ({ ...m, ...entries }));
    setUserTurns((n) => n + 1);

    window.setTimeout(
      () => {
        setMoving((m) => {
          const n = { ...m };
          for (const k of Object.keys(entries)) {
            if (n[+k]?.token === tk) delete n[+k];
          }
          return n;
        });
      },
      TURN_MS + span * stagger + 80,
    );
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const next = useCallback(() => go(turnedRef.current + 1), [go]);
  const prev = useCallback(() => go(turnedRef.current - 1), [go]);
  const goToPage = useCallback(
    (page: number) => {
      const mode = layoutRef.current?.mode;
      if (mode) go(pageToTurned(page, mode));
    },
    [go],
  );

  /* ------------------------------ clavier ------------------------------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxRef.current) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select")) return;
      const onButton = !!el?.closest("button");
      const mode = layoutRef.current?.mode ?? "single";
      if (e.key === "ArrowRight" || e.key === "PageDown" || (e.key === " " && !onButton)) {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        go(0);
      } else if (e.key === "End") {
        go(maxTurned(mode));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, next, prev]);

  /* ------------------------------ molette ------------------------------- */

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let acc = 0;
    let last = 0;
    let reset = 0;
    const onWheel = (e: WheelEvent) => {
      if (lightboxRef.current) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      // Une page trop longue pour l'écran défile d'abord elle-même.
      const scroller = (e.target as HTMLElement | null)?.closest<HTMLElement>(".page-body");
      if (scroller && scroller.scrollHeight > scroller.clientHeight + 2) {
        const atTop = scroller.scrollTop <= 0;
        const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
        if ((d > 0 && !atBottom) || (d < 0 && !atTop)) return;
      }
      acc += d;
      window.clearTimeout(reset);
      reset = window.setTimeout(() => (acc = 0), 220);
      const now = performance.now();
      if (Math.abs(acc) > 60 && now - last > 700) {
        last = now;
        if (acc > 0) next();
        else prev();
        acc = 0;
      }
    };
    stage.addEventListener("wheel", onWheel, { passive: true });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [next, prev, layout]);

  /* ---------------------- glisser du doigt / souris --------------------- */

  const onPointerDown = (e: React.PointerEvent) => {
    if (lightbox || !layout) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest(".bar")) return;
    drag.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      t0: performance.now(),
      lastX: e.clientX,
      lastT: performance.now(),
      active: false,
      dir: 1,
      leaf: -1,
      progress: 0,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId || !layout) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;

    if (!d.active) {
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      const dir: 1 | -1 = dx < 0 ? 1 : -1;
      const leaf = dir === 1 ? turnedRef.current : turnedRef.current - 1;
      if (leaf < 0 || (dir === 1 && turnedRef.current >= maxTurned(layout.mode))) {
        drag.current = null;
        return;
      }
      d.active = true;
      d.dir = dir;
      d.leaf = leaf;
      // On repart de là où le doigt est vraiment, pour éviter un saut.
      d.x0 = e.clientX;
      setDragging(leaf);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* rien */
      }
    }

    const span = layout.mode === "spread" ? layout.pw * 1.35 : layout.pw * 0.85;
    const moved = e.clientX - d.x0;
    const p = Math.min(1, Math.max(0, d.dir === 1 ? -moved / span : moved / span));
    d.progress = p;
    d.lastX = e.clientX;
    d.lastT = performance.now();
    const angle = d.dir === 1 ? -180 * p : -180 + 180 * p;
    const el = leafRefs.current[d.leaf];
    if (el) {
      el.style.transform = `rotateY(${angle}deg)`;
      el.style.setProperty("--lift", String(Math.sin((Math.abs(angle) / 180) * Math.PI)));
    }
  };

  const endDrag = (e: React.PointerEvent, cancelled = false) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId || !layout) return;

    if (!d.active) {
      if (cancelled) return;
      // Un simple toucher : sur le bord de la page, on tourne.
      const target = e.target as HTMLElement;
      if (target.closest("button, a, video, [data-zoom], .bar")) return;
      const rect = bookRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width;
      if (layout.mode === "single") {
        if (x > 0.32) next();
        else prev();
      } else if (turnedRef.current === 0) {
        if (x > 0.5) next();
      } else if (turnedRef.current === maxTurned("spread")) {
        if (x < 0.5) prev();
      } else if (x > 0.76) {
        next();
      } else if (x < 0.24) {
        prev();
      }
      return;
    }

    justDragged.current = true;
    window.setTimeout(() => (justDragged.current = false), 0);

    const el = leafRefs.current[d.leaf];
    const dt = Math.max(1, performance.now() - d.t0);
    const velocity = Math.abs(e.clientX - d.x0) / dt; // px/ms
    const commit = !cancelled && (d.progress > 0.32 || (velocity > 0.45 && d.progress > 0.05));

    // La feuille reprend sa transition depuis l'angle où le doigt l'a laissée.
    if (el) {
      el.style.transform = "";
      el.style.removeProperty("--lift");
    }
    setDragging(null);

    if (commit) {
      go(turnedRef.current + d.dir);
    } else {
      const tk = ++token.current;
      setMoving((m) => ({ ...m, [d.leaf]: { delay: 0, forward: d.dir === -1, token: tk } }));
      window.setTimeout(() => {
        setMoving((m) => {
          if (m[d.leaf]?.token !== tk) return m;
          const n = { ...m };
          delete n[d.leaf];
          return n;
        });
      }, TURN_MS);
    }
  };

  /* ------------------------------- rendu -------------------------------- */

  if (!layout) {
    return <div className="scene is-loading" />;
  }

  const { mode, pw, ph } = layout;
  const L = leafCount(mode);
  const max = maxTurned(mode);
  const visible = visiblePages(turned, mode);
  const anchor = turnedToPage(turned, mode);
  const nearRadius = mode === "spread" ? 4 : 3;

  const labelPage = mode === "spread" ? (visible[visible.length - 1] ?? 0) : turned;
  const running = runningFor(mode === "spread" ? (visible[0] ?? 0) : turned) || runningFor(labelPage);
  const folio = PAGES[labelPage]?.folio;
  const lastFolio = PAGES.reduce((m, p) => Math.max(m, p.folio ?? 0), 0);
  const label =
    turned === 0
      ? "Couverture"
      : turned === max && mode === "spread"
        ? "Quatrième de couverture"
        : folio !== undefined
          ? `Page ${folio} sur ${lastFolio}`
          : PAGES[labelPage]?.kind === "backcover"
            ? "Quatrième de couverture"
            : "Page de garde";

  let shift = 0;
  if (mode === "spread") {
    if (turned === 0) shift = -pw / 2;
    else if (turned === L) shift = pw / 2;
  }

  const showCoverHint = turned === 0 && userTurns === 0;
  const showSwipeHint = turned > 0 && userTurns <= 1;

  return (
    <div
      className={`scene mode-${mode}`}
      style={{ "--pw": `${pw}px`, "--ph": `${ph}px` } as React.CSSProperties}
    >
      <div className="ambient" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="mote" style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>

      <header className="bar bar-top">
        <button
          type="button"
          className="chip"
          onClick={() => goToPage(CONTENTS_PAGE)}
          aria-label="Aller au sommaire"
        >
          <ListIcon className="chip-icon" />
          <span className="chip-text">Sommaire</span>
        </button>
        <p className="bar-running">{running}</p>
        {SOUNDTRACK ? (
          <button
            type="button"
            className={`chip round${playing ? " is-on" : ""}`}
            onClick={() => music.toggle()}
            aria-label={playing ? "Couper la musique" : "Mettre la musique"}
            aria-pressed={playing}
          >
            <NoteIcon on={playing} className="chip-icon" />
          </button>
        ) : (
          <span className="chip-spacer" />
        )}
      </header>

      <main
        ref={stageRef}
        className="stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e)}
        onPointerCancel={(e) => endDrag(e, true)}
        onClickCapture={(e) => {
          if (justDragged.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div
          ref={bookRef}
          className={`book${turned === 0 ? " is-closed" : ""}${turned === max && mode === "spread" ? " is-ended" : ""}`}
          style={
            {
              transform: `translateX(${shift}px)`,
              "--left-stack": Math.min(turned, 40),
              "--right-stack": Math.min(L - turned - 1, 40),
            } as React.CSSProperties
          }
          role="region"
          aria-roledescription="livre"
          aria-label={`Un livre pour ${FRIEND}`}
        >
          <div className="stack stack-l" aria-hidden="true" />
          <div className="stack stack-r" aria-hidden="true" />

          {Array.from({ length: L }, (_, i) => {
            const [fp, bp] = leafPages(i, mode);
            const isTurned = i < turned;
            const mv = moving[i];
            const isDragging = dragging === i;
            // On garde dessinées les deux feuilles voisines : c'est elles qu'on
            // découvre pendant qu'une page se soulève sous le doigt.
            const buried = !mv && !isDragging && (isTurned ? i < turned - 2 : i > turned + 1);

            let z = isTurned ? i + 1 : L - i;
            if (mv) z = L + 10 + (mv.forward ? i : L - i);
            if (isDragging) z = 3 * L + 20;

            const frontVisible = visible.includes(fp);
            const backVisible = bp !== null && visible.includes(bp);
            const near = (p: number) => Math.abs(p - anchor) <= nearRadius;

            const classes = [
              "leaf",
              isTurned && "is-turned",
              mv && "is-moving",
              isDragging && "is-dragging",
              buried && "is-buried",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={`${mode}-${i}`}
                ref={(el) => {
                  leafRefs.current[i] = el;
                }}
                className={classes}
                style={
                  {
                    zIndex: z,
                    transitionDelay: mv ? `${mv.delay}ms` : undefined,
                    "--d": mv ? `${mv.delay}ms` : undefined,
                  } as React.CSSProperties
                }
              >
                <div
                  className={`face front ${faceClass(PAGES[fp])} kind-${PAGES[fp].kind}`}
                  aria-hidden={!frontVisible}
                  inert={!frontVisible}
                >
                  <PageFace
                    page={PAGES[fp]}
                    near={near(fp)}
                    active={frontVisible && !lightbox}
                    onGo={goToPage}
                    onZoom={setLightbox}
                    onRestart={() => go(0)}
                  />
                </div>
                <div
                  className={`face back ${bp !== null ? `${faceClass(PAGES[bp])} kind-${PAGES[bp].kind}` : "paper kind-verso"}`}
                  aria-hidden={!backVisible}
                  inert={!backVisible}
                >
                  {bp !== null && (
                    <PageFace
                      page={PAGES[bp]}
                      near={near(bp)}
                      active={backVisible && !lightbox}
                      onGo={goToPage}
                      onZoom={setLightbox}
                      onRestart={() => go(0)}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {turned > 0 && !(mode === "spread" && turned === L) && (
            <span className="ribbon" aria-hidden="true" />
          )}
        </div>

        {showCoverHint && <p className="hint hint-cover">Touche la couverture pour ouvrir le livre</p>}
        {showSwipeHint && (
          <p className="hint hint-swipe">
            <span className="hint-hand" aria-hidden="true" />
            Glisse pour tourner les pages
          </p>
        )}
      </main>

      <footer className="bar bar-bottom">
        <button type="button" className="nav-btn" onClick={prev} disabled={turned === 0} aria-label="Page précédente">
          <ChevronLeft className="nav-icon" />
        </button>
        <div className="progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${(turned / max) * 100}%` }} />
          </div>
          <p className="progress-label" aria-live="polite">
            {label}
          </p>
        </div>
        <button type="button" className="nav-btn" onClick={next} disabled={turned === max} aria-label="Page suivante">
          <ChevronRight className="nav-icon" />
        </button>
      </footer>

      {lightbox && <Lightbox souvenir={lightbox} onClose={closeLightbox} />}
    </div>
  );
}
