"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/lib/copy";
import { activityQuestion, questions } from "@/lib/questions";
import type { Submission } from "@/lib/types";

export default function AnswersPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(pw: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.status === 401) {
        setError(copy.answers.wrongPassword);
        setUnlocked(false);
        return;
      }
      if (!res.ok) {
        setError(copy.submitError);
        return;
      }
      const data = (await res.json()) as { submissions: Submission[] };
      setSubmissions(data.submissions);
      setUnlocked(true);
    } catch {
      setError(copy.submitError);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void load(password);
  }

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

          {!unlocked ? (
            <form className="admin-form" onSubmit={onSubmit}>
              <label className="field">
                <span>{copy.answers.passwordLabel}</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="cta" disabled={loading}>
                {loading ? copy.answers.loading : copy.answers.unlock}
              </button>
              {error && <p className="error">{error}</p>}
            </form>
          ) : (
            <div className="submissions">
              <button
                type="button"
                className="text-btn"
                onClick={() => void load(password)}
                disabled={loading}
              >
                {copy.answers.refresh}
              </button>
              {submissions.length === 0 ? (
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
                              <em>
                                {copy.answers.noAttempts(a.noAttempts)}
                              </em>
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
          )}
        </section>
      </div>
    </main>
  );
}
