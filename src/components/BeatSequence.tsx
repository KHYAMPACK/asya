"use client";

import { useEffect, useState } from "react";

type Props = {
  lines: readonly string[];
  holdMs?: number;
  outMs?: number;
  /** lines from this index use quickHoldMs */
  quickFromIndex?: number;
  quickHoldMs?: number;
  onDone: () => void;
};

export function BeatSequence({
  lines,
  holdMs = 1500,
  outMs = 360,
  quickFromIndex,
  quickHoldMs = 850,
  onDone,
}: Props) {
  const [line, setLine] = useState(lines[0] ?? "");
  const [out, setOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    function holdFor(i: number) {
      if (quickFromIndex !== undefined && i >= quickFromIndex) {
        return quickHoldMs;
      }
      return holdMs;
    }

    function show(i: number) {
      if (cancelled) return;
      if (i >= lines.length) {
        onDone();
        return;
      }

      setOut(false);
      setLine(lines[i] ?? "");

      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          if (i >= lines.length - 1) {
            onDone();
            return;
          }
          setOut(true);
          timers.push(window.setTimeout(() => show(i + 1), outMs));
        }, holdFor(i)),
      );
    }

    show(0);

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
    // mount once for this beat screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="panel color-init enter" aria-live="polite">
      <div className="init-mark" aria-hidden>
        <span className="init-dot" />
      </div>
      <h2
        className={`prompt init-prompt ${out ? "is-out" : ""}`}
        key={line}
      >
        {line}
      </h2>
    </section>
  );
}
