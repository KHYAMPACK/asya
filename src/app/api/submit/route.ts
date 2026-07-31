import { NextResponse } from "next/server";
import { saveSubmission } from "@/lib/store";
import type { AnswerValue, Submission } from "@/lib/types";
import { questions } from "@/lib/questions";

export const runtime = "nodejs";

type Body = {
  answers?: Record<string, AnswerValue>;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (!body.answers || typeof body.answers !== "object") {
    return NextResponse.json({ error: "Cevaplar eksik" }, { status: 400 });
  }

  const expectedIds = new Set([
    ...questions.map((q) => q.id),
    "car-playlist",
    "aktivite",
    "cicek",
  ]);
  const answeredIds = Object.keys(body.answers);
  if (answeredIds.length === 0) {
    return NextResponse.json({ error: "Cevaplar eksik" }, { status: 400 });
  }

  for (const id of answeredIds) {
    if (!expectedIds.has(id)) {
      return NextResponse.json({ error: "Geçersiz soru" }, { status: 400 });
    }
    const a = body.answers[id];
    if (!a?.value || !a?.label) {
      return NextResponse.json({ error: "Geçersiz cevap" }, { status: 400 });
    }
  }

  const submission: Submission = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    answers: body.answers,
  };

  try {
    await saveSubmission(submission);
  } catch {
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: submission.id });
}
