import { NextResponse } from "next/server";
import { listSubmissions } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const submissions = await listSubmissions();
    return NextResponse.json({ submissions });
  } catch {
    return NextResponse.json({ error: "Okunamadı" }, { status: 500 });
  }
}
