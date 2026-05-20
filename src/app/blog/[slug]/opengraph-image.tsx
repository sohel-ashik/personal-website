import { ImageResponse } from "next/og";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { siteConfig } from "@/content/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let title = "Blog post";
  let summary = siteConfig.description;
  let tags: string[] = [];

  if (isDBConfigured) {
    try {
      await connectDB();
      const post = await Post.findOne({ slug, published: true }).select("title summary tags").lean();
      if (post) {
        title = post.title;
        summary = post.summary;
        tags = post.tags?.slice(0, 3) ?? [];
      }
    } catch {
      // fallback to defaults
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px 64px",
          background: "linear-gradient(135deg, #0a0a0b 0%, #1a0a2e 60%, #0a0a0b 100%)",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: "20%", left: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(167,139,250,0.12), transparent 70%)", borderRadius: "50%" }} />

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {tags.map((t) => (
              <span key={t} style={{ fontSize: 12, color: "#a78bfa", background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 20, padding: "4px 12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <div style={{ fontSize: 48, fontWeight: 800, color: "#ededed", lineHeight: 1.15, marginBottom: 18, display: "flex", maxWidth: "90%" }}>
          {title}
        </div>

        {/* Summary */}
        <div style={{ fontSize: 18, color: "#a1a1aa", lineHeight: 1.6, maxWidth: "80%", display: "flex" }}>
          {summary.length > 120 ? summary.slice(0, 120) + "…" : summary}
        </div>

        {/* Author strip */}
        <div style={{ position: "absolute", bottom: 40, right: 60, fontSize: 14, color: "#52525b", fontFamily: "monospace", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <span style={{ color: "#a78bfa", fontWeight: 600 }}>{siteConfig.name}</span>
          <span>sohelashik.com/blog</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
