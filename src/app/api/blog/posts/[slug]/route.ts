import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import readingTime from "reading-time";
import { connectDB } from "@/lib/db";
import { Post, serializePost } from "@/lib/models/Post";
import { requireAuth, isAuthenticatedFromRequest } from "@/lib/blog-auth";

type Params = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  await connectDB();
  const { slug } = await params;
  const authed = isAuthenticatedFromRequest(req);
  const post = await Post.findOne(authed ? { slug } : { slug, published: true });
  if (!post) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Increment view count silently
  if (!authed && post.published) {
    Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).exec();
  }

  return NextResponse.json(serializePost(post));
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    requireAuth(req);
  } catch (err) {
    return err as NextResponse;
  }

  await connectDB();
  const { slug } = await params;

  let body: {
    title?: string;
    summary?: string;
    content?: string;
    tags?: string[];
    coverImage?: string;
    seo?: { title?: string; description?: string; keywords?: string[]; ogImage?: string };
    slug?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const update: Record<string, unknown> = { ...body };
  if (body.content) {
    const rt = readingTime(body.content);
    update.readingTimeMinutes = Math.max(1, Math.round(rt.minutes));
  }
  delete update.published; // publish is handled by the /publish endpoint

  const post = await Post.findOneAndUpdate({ slug }, update, { new: true });
  if (!post) return NextResponse.json({ error: "Not found." }, { status: 404 });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json(serializePost(post));
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    requireAuth(req);
  } catch (err) {
    return err as NextResponse;
  }

  await connectDB();
  const { slug } = await params;
  const post = await Post.findOneAndDelete({ slug });
  if (!post) return NextResponse.json({ error: "Not found." }, { status: 404 });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ ok: true });
}
