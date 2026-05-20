import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/blog-auth";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Post, serializePost } from "@/lib/models/Post";
import { Editor } from "@/components/blog/Editor";

export const metadata = {
  title: "Edit Post",
  robots: { index: false, follow: false },
};

type Params = { params: Promise<{ slug: string }> };

export default async function EditPostPage({ params }: Params) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/blog/write/ashik");

  const { slug } = await params;

  if (!isDBConfigured) notFound();

  await connectDB();
  const post = await Post.findOne({ slug });
  if (!post) notFound();

  const data = serializePost(post);
  return <Editor mode="edit" initialData={data} />;
}
