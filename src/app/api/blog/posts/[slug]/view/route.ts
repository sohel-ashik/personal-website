import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Post } from "@/lib/models/Post";

// Deduplicate: same IP + same slug within 6 hours
const recentViews = new Map<string, number>();
const DEDUP_MS = 6 * 60 * 60 * 1000;

type Params = { params: Promise<{ slug: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  if (!isDBConfigured) return NextResponse.json({ ok: true });

  const { slug } = await params;
  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const key = `${ip}::${slug}`;
  const last = recentViews.get(key);
  if (last && Date.now() - last < DEDUP_MS) {
    return NextResponse.json({ ok: true });
  }
  recentViews.set(key, Date.now());

  try {
    await connectDB();
    await Post.findOneAndUpdate({ slug, published: true }, { $inc: { views: 1 } });
  } catch {
    // silent
  }

  return NextResponse.json({ ok: true });
}
