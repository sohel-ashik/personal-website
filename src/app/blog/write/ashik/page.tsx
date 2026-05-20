import { isAuthenticated } from "@/lib/blog-auth";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Post, serializePost } from "@/lib/models/Post";
import { AuthGate } from "@/components/blog/AuthGate";
import { Dashboard } from "@/components/blog/Dashboard";
import type { PostData } from "@/lib/models/Post";

export const metadata = {
  title: "Blog Dashboard",
  robots: { index: false, follow: false },
};

async function getAllPosts(): Promise<PostData[]> {
  if (!isDBConfigured) return [];
  try {
    await connectDB();
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .select("-content")
      .lean();
    return posts.map((p) => serializePost(p as Parameters<typeof serializePost>[0]));
  } catch {
    return [];
  }
}

export default async function BlogWritePage() {
  const authed = await isAuthenticated();

  if (!authed) {
    return <AuthGate />;
  }

  const posts = await getAllPosts();
  return <Dashboard posts={posts} />;
}
