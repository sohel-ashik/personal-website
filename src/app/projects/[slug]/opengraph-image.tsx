import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/content/projects";
import { siteConfig } from "@/content/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const title = project?.title ?? "Project";
  const description = project?.summary ?? siteConfig.description;
  const category = project?.category ?? "Web";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          background: "linear-gradient(135deg, #0a0a0b 0%, #1a0a2e 50%, #0a0a0b 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 30% 50%, rgba(167,139,250,0.15), transparent 70%)",
          }}
        />
        <div
          style={{
            fontSize: 14,
            color: "#a78bfa",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: 16,
            display: "flex",
          }}
        >
          {category} · {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ededed",
            lineHeight: 1.1,
            marginBottom: 20,
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#a1a1aa",
            lineHeight: 1.5,
            maxWidth: "80%",
            display: "flex",
          }}
        >
          {description}
        </div>
      </div>
    ),
    { ...size }
  );
}
