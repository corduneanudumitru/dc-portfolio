"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Collection } from "@/portfolio/data";
import Photo from "./Photo";
export default function Gallery({
  collection: c,
  locale = "en",
}: {
  collection: Collection;
  locale?: string;
}) {
  const [mode, setMode] = useState("sequence");
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const modeButton = useRef<HTMLButtonElement | null>(null);
  const returnScroll = useRef({ x: 0, y: 0 });
  const isOpen = index !== null;
  const photos = c.groups.flatMap((g) => g.photos);
  const ro = locale === "ro";
  useEffect(() => {
    if (!isOpen) return;
    const d = dialog.current;
    if (!d?.open) d?.showModal();
    document.body.classList.add("modal-open");
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);
  function close() {
    dialog.current?.close();
    setIndex(null);
    document.body.classList.remove("modal-open");
    const trigger = returnFocus.current;
    const target = trigger?.isConnected ? trigger : modeButton.current;
    target?.focus({ preventScroll: true });
    window.scrollTo({
      left: returnScroll.current.x,
      top: returnScroll.current.y,
      behavior: "instant",
    });
  }
  function open(i: number, trigger: HTMLButtonElement) {
    // Pointer activation does not focus buttons in every browser (notably WebKit).
    // Capture the actual trigger and make native dialog restoration agree with it.
    returnFocus.current = trigger;
    returnScroll.current = { x: window.scrollX, y: window.scrollY };
    trigger.focus({ preventScroll: true });
    setIndex(i);
  }
  function figure(i: number) {
    const p = photos[i];
    return (
      <figure
        key={p.id + "-" + i}
        style={{ "--ratio": p.width / p.height } as CSSProperties}
      >
        <button
          type="button"
          onClick={(event) => open(i, event.currentTarget)}
          aria-label={`${ro ? "Mărește fotografia" : "Enlarge photograph"} ${i + 1}`}
        >
          <Photo photo={p} priority={i < 3} locale={locale} />
        </button>
        <figcaption>{String(i + 1).padStart(2, "0")}</figcaption>
      </figure>
    );
  }
  let offset = 0;
  const step = (delta: number) =>
    setIndex((i) =>
      i === null ? null : Math.max(0, Math.min(photos.length - 1, i + delta)),
    );
  const prev = ro ? "Precedenta" : "Previous";
  const next = ro ? "Următoarea" : "Next";
  return (
    <>
      <div className="gallery-toolbar">
        <span>
          {photos.length} {ro ? "fotografii" : "photographs"}
          {c.slug === "moldova"
            ? ro
              ? " · Proiect în desfășurare"
              : " · Work in progress"
            : ""}
        </span>
        <div
          className="segmented"
          aria-label={ro ? "Vizualizare" : "Gallery view"}
        >
          {["sequence", "overview"].map((m) => (
            <button
              key={m}
              ref={mode === m ? modeButton : undefined}
              className={mode === m ? "active" : ""}
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
            >
              {m === "sequence"
                ? ro
                  ? "Secvență"
                  : "Sequence"
                : ro
                  ? "Privire de ansamblu"
                  : "Overview"}
            </button>
          ))}
        </div>
      </div>
      {mode === "overview" ? (
        <div className="overview">{photos.map((_, i) => figure(i))}</div>
      ) : (
        <div className="sequence">
          {c.groups.map((g, row) => {
            const start = offset;
            offset += g.photos.length;
            const count = g.photos.length;
            const ratio = g.photos.reduce((n, p) => n + p.width / p.height, 0);
            const cap = Math.min(
              count === 1 ? 960 : 1080,
              ratio * (count === 1 ? (row === 0 ? 640 : 560) : 480) +
                (count - 1) * 24,
            );
            return (
              <div
                key={g.key}
                className={`photo-row ${count === 1 ? "single" : count === 3 ? "triptych" : "pair"} ${row === 0 ? "opening" : ""} ${row === c.groups.length - 1 ? "closing" : ""}`}
                style={{ "--row-cap": cap + "px" } as CSSProperties}
              >
                {g.photos.map((_, i) => figure(start + i))}
              </div>
            );
          })}
        </div>
      )}
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={ro ? "Vizualizator de fotografii" : "Photograph viewer"}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            const controls = Array.from(
              dialog.current?.querySelectorAll<HTMLButtonElement>(
                "button:not(:disabled)",
              ) || [],
            );
            const first = controls[0],
              last = controls[controls.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          }
        }}
      >
        {index !== null && (
          <div className="lightbox-inner">
            <div className="lightbox-bar">
              <span>{ro && c.titleRo ? c.titleRo : c.title}</span>
              <button
                ref={closeButton}
                onClick={close}
                aria-label={
                  ro ? "Închide fotografia" : "Close photograph viewer"
                }
              >
                {ro ? "Închide" : "Close"} ×
              </button>
            </div>
            <div className="lightbox-stage">
              <button
                className="viewer-arrow"
                aria-label={`${prev} photograph`}
                disabled={index === 0}
                onClick={() => step(-1)}
              >
                ‹
              </button>
              <Photo photo={photos[index]} viewer locale={locale} />
              <button
                className="viewer-arrow"
                aria-label={`${next} photograph`}
                disabled={index === photos.length - 1}
                onClick={() => step(1)}
              >
                ›
              </button>
            </div>
            <div className="lightbox-bottom">
              <button disabled={index === 0} onClick={() => step(-1)}>
                ← {prev}
              </button>
              <span aria-live="polite">
                {index + 1} / {photos.length}
              </span>
              <button
                disabled={index === photos.length - 1}
                onClick={() => step(1)}
              >
                {next} →
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
