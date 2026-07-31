import { NextResponse } from "next/server";
import { getRedis, SUBMISSIONS_KEY } from "@/lib/redis";
import type { Submission } from "@/lib/types";

export const runtime = "nodejs";

function parseSubmission(raw: unknown): Submission | null {
  if (!raw) return null;
  if (typeof raw === "object" && raw !== null && "id" in raw) {
    return raw as Submission;
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Submission;
    } catch {
      return null;
    }
  }
  return null;
}

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin şifresi ayarlı değil" },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (body.password !== adminPassword) {
    return NextResponse.json({ error: "şifre yanlış" }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(
      { error: "Depolama yapılandırılmamış" },
      { status: 503 },
    );
  }

  const rawList = await redis.lrange(SUBMISSIONS_KEY, 0, 49);
  const submissions = rawList
    .map(parseSubmission)
    .filter((s): s is Submission => Boolean(s));

  return NextResponse.json({ submissions });
}
