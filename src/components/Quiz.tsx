"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ActivityIcon } from "@/components/ActivityIcon";
import { ActivityMusic } from "@/components/ActivityMusic";
import { BeatSequence } from "@/components/BeatSequence";
import { CarPlaylistPicker } from "@/components/CarPlaylistPicker";
import { BouquetVisual } from "@/components/BouquetVisual";
import { PrepIcon } from "@/components/PrepIcon";
import { StubbornButtons } from "@/components/StubbornButtons";
import { copy } from "@/lib/copy";
import { carSongs, type CarSong } from "@/lib/carSongs";
import {
  flowerById,
  flowerOptions,
  type FlowerId,
} from "@/lib/flowers";
import {
  activityQuestion,
  colorThemeById,
  questions,
  type ColorTheme,
} from "@/lib/questions";
import type { AnswerValue } from "@/lib/types";

type Phase =
  | "welcome"
  | "fakeName"
  | "nameReveal"
  | "quiz"
  | "colorInit"
  | "musicPrep"
  | "carPlaylist"
  | "playlistBeat"
  | "activity"
  | "placeBeat"
  | "flower"
  | "flowerGift"
  | "done";

export function Quiz() {
  const total = questions.length;
  const [phase, setPhase] = useState<Phase>("welcome");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<ColorTheme | null>(null);
  const [initLine, setInitLine] = useState<string>(copy.colorInit[0]);
  const [bloomOn, setBloomOn] = useState(false);
  const [themeSettled, setThemeSettled] = useState(false);
  const [initDone, setInitDone] = useState(false);
  const [initTextOut, setInitTextOut] = useState(false);
  const [bgSong, setBgSong] = useState<CarSong | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<CarSong[]>([]);
  const [pickedFlower, setPickedFlower] = useState<FlowerId | null>(null);
  const [flowerBlooming, setFlowerBlooming] = useState(false);
  const [fakeName, setFakeName] = useState("");
  const [revealLine, setRevealLine] = useState<string>(copy.nameReveal[0]);
  const [revealOut, setRevealOut] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const onTrackChange = useCallback((song: CarSong) => {
    setBgSong(song);
  }, []);

  const skipPool = playlistSongs.length > 1 ? playlistSongs : carSongs;

  function skipBgSong() {
    if (!bgSong || skipPool.length < 2) return;
    const idx = skipPool.findIndex((s) => s.id === bgSong.id);
    const next = skipPool[(idx + 1 + skipPool.length) % skipPool.length];
    if (next) setBgSong(next);
  }

  const question = questions[index];

  useEffect(() => {
    if (phase !== "nameReveal") return;

    let cancelled = false;
    const timers: number[] = [];
    const hold = 1600;
    const outDur = 380;

    copy.nameReveal.forEach((line, i) => {
      const start = i * (hold + outDur);
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          setRevealOut(false);
          setRevealLine(line);
        }, start),
      );

      if (i < copy.nameReveal.length - 1) {
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) setRevealOut(true);
          }, start + hold),
        );
      }
    });

    const doneAt =
      (copy.nameReveal.length - 1) * (hold + outDur) + hold + 400;
    timers.push(
      window.setTimeout(() => {
        if (!cancelled) setPhase("quiz");
      }, doneAt),
    );

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "colorInit" || !theme) return;

    let cancelled = false;
    const timers: number[] = [];

    copy.colorInit.forEach((line, i) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setInitLine(line);
        }, i * 900),
      );
    });

    const bloomAt = copy.colorInit.length * 900 + 250;
    timers.push(
      window.setTimeout(() => {
        if (!cancelled) setInitTextOut(true);
      }, bloomAt),
    );
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setInitDone(true);
        setBloomOn(true);
      }, bloomAt + 280),
    );

    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setThemeSettled(true);
        setBloomOn(false);
        setPhase("musicPrep");
      }, bloomAt + 280 + 1200),
    );

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [phase, theme]);

  async function unlockAudio() {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return;
      const ctx = audioCtxRef.current ?? new Ctx();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch {
      // continue
    }
  }

  async function continueFromMusicPrep() {
    await unlockAudio();
    setPhase("carPlaylist");
  }

  function showToast(line: string) {
    setToast(line);
    window.setTimeout(() => setToast(null), 1600);
  }

  async function finish(nextAnswers: Record<string, AnswerValue>) {
    setSubmitting(true);
    setError(null);
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      });
    } catch {
      // Save is best-effort — never block her finale
    } finally {
      setSubmitting(false);
    }
  }

  function recordAndAdvance(value: AnswerValue) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);

    if (question.id === "favori-renk") {
      const picked = colorThemeById[value.value];
      if (picked) {
        setTheme(picked);
        setBloomOn(false);
        setThemeSettled(false);
        setInitDone(false);
        setInitTextOut(false);
        setInitLine(copy.colorInit[0]);
        setPhase("colorInit");
        return;
      }
    }

    if (index >= total - 1) {
      void finish(next);
      return;
    }
    setIndex((i) => i + 1);
  }

  function onCarPlaylistComplete(picked: CarSong[]) {
    const next = {
      ...answers,
      "car-playlist": {
        value: picked.map((s) => s.id).join(","),
        label: picked
          .map((s) => (s.artist ? `${s.title} — ${s.artist}` : s.title))
          .join(" · "),
      },
    };
    setAnswers(next);
    setPlaylistSongs(picked);
    const last = picked[picked.length - 1] ?? null;
    if (last) setBgSong(last);
    setPhase("playlistBeat");
  }

  function onActivityPick(opt: { id: string; label: string }) {
    const next = {
      ...answers,
      [activityQuestion.id]: {
        value: opt.id,
        label: opt.label,
      },
    };
    setAnswers(next);
    setPhase("placeBeat");
  }

  function onFlowerPick(id: FlowerId) {
    const flower = flowerById[id];
    const next = {
      ...answers,
      cicek: {
        value: id,
        label: flower.label,
      },
    };
    setAnswers(next);
    setPickedFlower(id);
    setFlowerBlooming(false);
    setPhase("flowerGift");
    window.setTimeout(() => setFlowerBlooming(true), 100);
    window.setTimeout(() => {
      void finish(next);
    }, 4500);
  }

  const themeStyle = theme
    ? ({
        "--theme-bg": theme.bg,
        "--theme-ink": theme.ink,
        "--theme-ink-soft": theme.inkSoft,
        "--theme-accent": theme.accent,
      } as CSSProperties)
    : undefined;

  return (
    <main
      className={`shell ${themeSettled ? "has-theme" : ""} ${theme?.dark ? "theme-dark" : ""}`}
      style={themeStyle}
    >
      <div
        className={`atmosphere ${themeSettled ? "is-themed" : ""}`}
        aria-hidden
      />
      <div
        className={`color-bloom ${bloomOn ? "is-expanding" : ""}`}
        style={theme ? { background: theme.bg } : undefined}
        aria-hidden
      />

      <div className="content">
        {phase === "welcome" && (
          <section className="panel welcome welcome-minimal enter">
            <button
              type="button"
              className="cta cta-hero"
              onClick={() => setPhase("fakeName")}
            >
              {copy.start}
            </button>
          </section>
        )}

        {phase === "fakeName" && (
          <section className="panel fake-name enter">
            <h2 className="prompt">{copy.fakeName.prompt}</h2>
            <input
              className="fake-name-input"
              type="text"
              name="name"
              autoComplete="off"
              autoFocus
              placeholder={copy.fakeName.placeholder}
              value={fakeName}
              onChange={(e) => {
                const value = e.target.value;
                setFakeName(value);
                if (value.trim().length > 0 && phase === "fakeName") {
                  setRevealLine(copy.nameReveal[0]);
                  setRevealOut(false);
                  setPhase("nameReveal");
                }
              }}
            />
          </section>
        )}

        {phase === "nameReveal" && (
          <section className="panel name-reveal enter" aria-live="polite">
            <h2
              className={`prompt name-reveal-line ${revealOut ? "is-out" : ""}`}
              key={revealLine}
            >
              {revealLine}
            </h2>
          </section>
        )}

        {phase === "colorInit" && (
          <section className="panel color-init enter" aria-live="polite">
            <div
              className={`init-mark ${initDone ? "is-check" : ""}`}
              aria-hidden
            >
              <span className="init-dot" />
              <svg
                className="init-check"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  className="init-check-path"
                  d="M5 12.5l4.5 4.5L19 7"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {!initDone && (
              <h2
                className={`prompt init-prompt ${initTextOut ? "is-out" : ""}`}
                key={initLine}
              >
                {initLine}
              </h2>
            )}
          </section>
        )}

        {phase === "musicPrep" && (
          <section className="panel music-prep enter">
            <ul className="prep-list">
              {copy.musicPrep.items.map((item) => (
                <li key={item.id} className="prep-item">
                  <span className="prep-icon">
                    <PrepIcon id={item.id} />
                  </span>
                  <span className="prep-copy">
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="cta"
              onClick={() => void continueFromMusicPrep()}
            >
              {copy.musicPrep.cta}
            </button>
          </section>
        )}

        {phase === "carPlaylist" && (
          <>
            <CarPlaylistPicker
              onComplete={onCarPlaylistComplete}
              onTrackChange={onTrackChange}
            />
            {error && <p className="error">{error}</p>}
            {submitting && <p className="status">{copy.submitting}</p>}
          </>
        )}

        {phase === "playlistBeat" && (
          <BeatSequence
            key="playlist-beat"
            lines={copy.beats.playlist}
            onDone={() => setPhase("activity")}
          />
        )}

        {phase === "activity" && (
          <section className="panel quiz activity enter">
            <h2 className="prompt">{activityQuestion.prompt}</h2>
            <div className="activity-grid">
              {activityQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className="activity-tile"
                  disabled={submitting}
                  onClick={() => onActivityPick(opt)}
                >
                  <span className="activity-icon">
                    <ActivityIcon id={opt.id} />
                  </span>
                  <span className="activity-label">{opt.label}</span>
                </button>
              ))}
            </div>
            {bgSong && (
              <ActivityMusic song={bgSong} onSkip={skipBgSong} />
            )}
            {error && <p className="error">{error}</p>}
            {submitting && <p className="status">{copy.submitting}</p>}
          </section>
        )}

        {phase === "placeBeat" && (
          <BeatSequence
            key="place-beat"
            lines={copy.beats.place}
            quickFromIndex={1}
            quickHoldMs={900}
            onDone={() => setPhase("flower")}
          />
        )}

        {phase === "flower" && (
          <section className="panel quiz activity enter">
            <h2 className="prompt">{copy.flower.prompt}</h2>
            <div className="activity-grid flower-grid">
              {flowerOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className="activity-tile flower-tile flower-tile-text"
                  style={
                    {
                      "--flower-accent": opt.color,
                    } as CSSProperties
                  }
                  disabled={submitting}
                  onClick={() => onFlowerPick(opt.id)}
                >
                  <span className="activity-label">{opt.label}</span>
                </button>
              ))}
            </div>
            {bgSong && (
              <ActivityMusic song={bgSong} onSkip={skipBgSong} />
            )}
          </section>
        )}

        {phase === "flowerGift" && pickedFlower && (
          <section className="panel flower-gift enter">
            <div className="flower-gift-stage">
              <BouquetVisual id={pickedFlower} blooming={flowerBlooming} />
            </div>
            <h2 className="prompt flower-gift-title">{copy.flower.gift}</h2>
            <p className="lead flower-gift-sub">{copy.flower.giftSub}</p>
          </section>
        )}

        {phase === "quiz" && question && (
          <section className="panel quiz enter" key={question.id}>
            <h2 className="prompt">{question.prompt}</h2>

            {question.type === "choice" ? (
              <div
                className={`options ${question.id === "favori-renk" ? "color-options" : ""}`}
              >
                {question.options.map((opt) => {
                  const swatch = colorThemeById[opt.id];
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`option-btn ${swatch ? "color-option" : ""}`}
                      disabled={submitting}
                      onClick={() =>
                        recordAndAdvance({
                          value: opt.id,
                          label: opt.label,
                        })
                      }
                    >
                      {swatch && (
                        <span
                          className="swatch"
                          style={{ background: swatch.bg }}
                          aria-hidden
                        />
                      )}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <StubbornButtons
                question={question}
                onGag={showToast}
                onYes={(noAttempts) =>
                  recordAndAdvance({
                    value: "yes",
                    label: question.yesLabel,
                    noAttempts,
                  })
                }
              />
            )}

            {error && <p className="error">{error}</p>}
            {submitting && <p className="status">{copy.submitting}</p>}
          </section>
        )}

        {phase === "done" && (
          <section className="panel done enter">
            <h1 className="brand small">{copy.doneTitle}</h1>
            <p className="lead">{copy.doneBody}</p>
          </section>
        )}
      </div>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </main>
  );
}
