import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/blog-auth";
import { Editor } from "@/components/blog/Editor";

export const metadata = {
  title: "New Post",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/blog/write/ashik");

  return <Editor mode="create" />;
}
