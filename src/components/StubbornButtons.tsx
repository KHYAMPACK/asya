"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { StubbornYesQuestion } from "@/lib/questions";

type Props = {
  question: StubbornYesQuestion;
  onYes: (noAttempts: number) => void;
  onGag: (line: string) => void;
};

const MAX_NO = 4;

export function StubbornButtons({ question, onYes, onGag }: Props) {
  const [noAttempts, setNoAttempts] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [shaking, setShaking] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNoAttempts(0);
    setOffset({ x: 0, y: 0 });
    setShaking(false);
  }, [question.id]);

  const gone =
    question.behavior === "shake-vanish"
      ? noAttempts >= MAX_NO - 1
      : noAttempts >= MAX_NO;

  const scale =
    question.behavior === "shrink"
      ? Math.max(0.15, 1 - noAttempts * 0.22)
      : gone
        ? 0
        : 1;

  function handleNo() {
    const next = noAttempts + 1;
    const line =
      question.gagLines[Math.min(next - 1, question.gagLines.length - 1)];
    onGag(line);
    setNoAttempts(next);

    if (question.behavior === "run") {
      const wrap = wrapRef.current;
      const maxX = wrap ? Math.min(110, wrap.clientWidth * 0.28) : 80;
      const maxY = 70;
      const x = (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * maxX);
      const y = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * maxY);
      setOffset({ x, y });
    }

    if (question.behavior === "shake-vanish") {
      setShaking(true);
      window.setTimeout(() => setShaking(false), 450);
    }
  }

  return (
    <div className="options stubborn-options" ref={wrapRef}>
      <button
        type="button"
        className="option-btn option-yes"
        onClick={() => onYes(noAttempts)}
      >
        {question.yesLabel}
      </button>
      {!gone && (
        <button
          type="button"
          className={`option-btn option-no ${shaking ? "is-shaking" : ""}`}
          style={
            {
              "--no-x": `${offset.x}px`,
              "--no-y": `${offset.y}px`,
              "--no-s": String(scale),
              opacity: scale < 0.25 ? 0.35 : 1,
              zIndex: 2,
            } as CSSProperties
          }
          onClick={handleNo}
          aria-label={question.noLabel}
        >
          {question.noLabel}
        </button>
      )}
    </div>
  );
}
