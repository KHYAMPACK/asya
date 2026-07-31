"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { copy } from "@/lib/copy";
import {
  colorThemeById,
  questions,
  type ColorTheme,
} from "@/lib/questions";
import type { AnswerValue } from "@/lib/types";
import { StubbornButtons } from "@/components/StubbornButtons";

type Phase = "welcome" | "quiz" | "colorInit" | "done";

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

  const question = questions[index];
  const progressLabel = useMemo(
    () => copy.progress(index + 1, total),
    [index, total],
  );

  useEffect(() => {
    if (phase !== "colorInit" || !theme) return;

    let cancelled = false;
    const timers: number[] = [];

    copy.colorInit.forEach((line, i) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setInitLine(line);
        }, i * 750),
      );
    });

    const bloomAt = copy.colorInit.length * 750 + 200;
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setInitLine(copy.colorReady);
        setBloomOn(true);
      }, bloomAt),
    );

    // Expand ~1.1s, then settle + advance
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setThemeSettled(true);
        setBloomOn(false);
        setPhase("quiz");
        setIndex((i) => i + 1);
      }, bloomAt + 1200),
    );

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [phase, theme]);

  function showToast(line: string) {
    setToast(line);
    window.setTimeout(() => setToast(null), 1600);
  }

  async function finish(nextAnswers: Record<string, AnswerValue>) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      });
      if (!res.ok) {
        throw new Error("submit failed");
      }
      setPhase("done");
    } catch {
      setError(copy.submitError);
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
          <section className="panel welcome enter">
            <p className="eyebrow">için</p>
            <h1 className="brand">{copy.brand}</h1>
            <p className="lead">{copy.welcomeLine}</p>
            <button
              type="button"
              className="cta"
              onClick={() => setPhase("quiz")}
            >
              {copy.start}
            </button>
          </section>
        )}

        {phase === "colorInit" && (
          <section className="panel color-init enter" aria-live="polite">
            <p className="init-dot" aria-hidden />
            <h2 className="prompt init-prompt">{initLine}</h2>
          </section>
        )}

        {phase === "quiz" && question && (
          <section className="panel quiz enter" key={question.id}>
            <div className="progress" aria-live="polite">
              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{ width: `${((index + 1) / total) * 100}%` }}
                />
              </div>
              <span>{progressLabel}</span>
            </div>
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
