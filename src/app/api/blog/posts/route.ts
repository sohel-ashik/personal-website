import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import readingTime from "reading-time";
import { connectDB } from "@/lib/db";
import { Post, serializePost } from "@/lib/models/Post";
import { slugify } from "@/lib/slugify";
import { isAuthenticatedFromRequest, requireAuth } from "@/lib/blog-auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const authed = isAuthenticatedFromRequest(req);
  const query = authed ? {} : { published: true };
  const posts = await Post.find(query)
    .sort({ publishedAt: -1, createdAt: -1 })
    .select("-content")
    .lean();
  return NextResponse.json(posts.map((p) => serializePost(p as Parameters<typeof serializePost>[0])));
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req);
  } catch (err) {
    return err as NextResponse;
  }

  await connectDB();

  let body: {
    title?: string;
    summary?: string;
    content?: string;
    tags?: string[];
    coverImage?: string;
    seo?: { title?: string; description?: string; keywords?: string[]; ogImage?: string };
    publish?: boolean;
    slug?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  if (!body.title || !body.summary || !body.content) {
    return NextResponse.json({ error: "title, summary, and content are required." }, { status: 422 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.title);
  const rt = readingTime(body.content);

  const post = await Post.create({
    slug,
    title: body.title,
    summary: body.summary,
    content: body.content,
    tags: body.tags ?? [],
    coverImage: body.coverImage,
    seo: body.seo ?? { keywords: [] },
    published: body.publish ?? false,
    publishedAt: body.publish ? new Date() : undefined,
    readingTimeMinutes: Math.max(1, Math.round(rt.minutes)),
  });

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");

  return NextResponse.json(serializePost(post), { status: 201 });
}
