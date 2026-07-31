"use client";

import { useCallback, useEffect, useState } from "react";
import { copy } from "@/lib/copy";
import { activityQuestion, questions } from "@/lib/questions";
import type { Submission } from "@/lib/types";

export default function AnswersPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/answers");
      if (!res.ok) {
        setError(copy.submitError);
        return;
      }
      const data = (await res.json()) as { submissions: Submission[] };
      setSubmissions(data.submissions);
    } catch {
      setError(copy.submitError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const promptById: Record<string, string> = {
    ...Object.fromEntries(questions.map((q) => [q.id, q.prompt])),
    "car-playlist": "Araba playlist",
    [activityQuestion.id]: activityQuestion.prompt,
    cicek: "Favori çiçek",
  };

  const answerOrder = [
    ...questions.map((q) => q.id),
    "car-playlist",
    activityQuestion.id,
    "cicek",
  ];

  return (
    <main className="shell admin-shell">
      <div className="atmosphere" aria-hidden />
      <div className="content">
        <section className="panel admin enter">
          <h1 className="brand small">{copy.answers.title}</h1>
          <p className="lead tight">{copy.answers.subtitle}</p>

          <div className="submissions">
            <button
              type="button"
              className="text-btn"
              onClick={() => void load()}
              disabled={loading}
            >
              {loading ? copy.answers.loading : copy.answers.refresh}
            </button>
            {!loading && submissions.length === 0 ? (
              <p className="lead tight">{copy.answers.empty}</p>
            ) : (
              submissions.map((sub) => (
                <article key={sub.id} className="submission">
                  <time dateTime={sub.createdAt}>
                    {new Date(sub.createdAt).toLocaleString("tr-TR")}
                  </time>
                  <ul>
                    {answerOrder.map((id) => {
                      const a = sub.answers[id];
                      if (!a) return null;
                      return (
                        <li key={id}>
                          <strong>{promptById[id]}</strong>
                          <span>{a.label}</span>
                          {typeof a.noAttempts === "number" && (
                            <em>{copy.answers.noAttempts(a.noAttempts)}</em>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </article>
              ))
            )}
            {error && <p className="error">{error}</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
