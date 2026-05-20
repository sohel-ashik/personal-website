import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie, clearSessionCookie } from "@/lib/blog-auth";

const WRITE_KEY = process.env.BLOG_WRITE_KEY;

// Simple rate limiter: max 5 attempts per minute per IP
const authAttempts = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = authAttempts.get(ip);
  if (!entry || now > entry.reset) {
    authAttempts.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Wait a minute." },
      { status: 429 }
    );
  }

  if (!WRITE_KEY) {
    return NextResponse.json({ error: "Blog not configured." }, { status: 503 });
  }

  let body: { key?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.key !== WRITE_KEY) {
    return NextResponse.json({ error: "Invalid key." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  setSessionCookie(res);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}
