import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Post, serializePost } from "@/lib/models/Post";
import { requireAuth } from "@/lib/blog-auth";

type Params = { params: Promise<{ slug: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    requireAuth(req);
  } catch (err) {
    return err as NextResponse;
  }

  await connectDB();
  const { slug } = await params;

  let body: { published?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const published = body.published ?? true;
  const update: { published: boolean; publishedAt?: Date } = { published };
  if (published) update.publishedAt = new Date();

  const post = await Post.findOneAndUpdate({ slug }, update, { new: true });
  if (!post) return NextResponse.json({ error: "Not found." }, { status: 404 });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json(serializePost(post));
}
