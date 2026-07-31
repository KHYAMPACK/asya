import { promises as fs } from "fs";
import path from "path";
import { getRedis, SUBMISSIONS_KEY } from "@/lib/redis";
import type { Submission } from "@/lib/types";

const FILE_PATH = path.join(process.cwd(), "data", "submissions.json");
const MAX = 100;

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

async function readFileStore(): Promise<Submission[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(parseSubmission)
      .filter((s): s is Submission => Boolean(s));
  } catch {
    return [];
  }
}

async function writeFileStore(list: Submission[]) {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(list.slice(0, MAX), null, 2), "utf8");
}

export async function saveSubmission(submission: Submission): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.lpush(SUBMISSIONS_KEY, JSON.stringify(submission));
    await redis.ltrim(SUBMISSIONS_KEY, 0, MAX - 1);
    return;
  }

  const list = await readFileStore();
  list.unshift(submission);
  await writeFileStore(list);
}

export async function listSubmissions(): Promise<Submission[]> {
  const redis = getRedis();
  if (redis) {
    const rawList = await redis.lrange(SUBMISSIONS_KEY, 0, 49);
    return rawList
      .map(parseSubmission)
      .filter((s): s is Submission => Boolean(s));
  }

  return readFileStore();
}
