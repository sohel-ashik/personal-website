import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Visit, parseUserAgent, anonymizeIp, parseReferrer } from "@/lib/models/Visit";
import { siteConfig } from "@/content/seo";

// Skip tracking admin + static routes
const SKIP_PATHS = [
  "/stats",
  "/blog/write",
  "/api/",
  "/_next/",
  "/favicon",
  "/manifest",
  "/robots",
  "/sitemap",
];

// Deduplicate: same IP + same path within 30 min counts once
const recentVisits = new Map<string, number>();
const DEDUP_MS = 30 * 60 * 1000;

function isDuplicate(key: string): boolean {
  const last = recentVisits.get(key);
  if (last && Date.now() - last < DEDUP_MS) return true;
  recentVisits.set(key, Date.now());
  // Cleanup old entries periodically
  if (recentVisits.size > 5000) {
    const cutoff = Date.now() - DEDUP_MS;
    for (const [k, v] of recentVisits) {
      if (v < cutoff) recentVisits.delete(k);
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  if (!isDBConfigured) return NextResponse.json({ ok: true });

  let body: { path?: string; referrer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const path = body.path ?? "/";

  // Skip admin / API routes
  if (SKIP_PATHS.some((skip) => path.startsWith(skip))) {
    return NextResponse.json({ ok: true });
  }

  const ua = req.headers.get("user-agent") ?? "";
  const rawIp =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const ip = anonymizeIp(rawIp);
  const dedupKey = `${ip}::${path}`;

  if (isDuplicate(dedupKey)) return NextResponse.json({ ok: true });

  // Country — Netlify sends x-country, Vercel sends x-vercel-ip-country
  const country =
    req.headers.get("x-country") ??
    req.headers.get("x-nf-geo-country") ??
    req.headers.get("x-vercel-ip-country") ??
    "Unknown";

  const referrerRaw = body.referrer ?? req.headers.get("referer") ?? "";
  const currentHost = new URL(siteConfig.url).hostname;
  const referrer = parseReferrer(referrerRaw, currentHost);

  const { browser, os, device } = parseUserAgent(ua);

  try {
    await connectDB();
    await Visit.create({ path, referrer, country, browser, os, device, ip, userAgent: ua });
  } catch {
    // Never crash the page over analytics
  }

  return NextResponse.json({ ok: true });
}
