import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/seo";
import { profile } from "@/content/profile";

export const runtime = "edge";
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #0a0a0b 0%, #1a0a2e 50%, #0a0a0b 100%)",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(167,139,250,0.15), transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ededed",
            lineHeight: 1.1,
            marginBottom: 16,
            display: "flex",
          }}
        >
          {profile.name}
        </div>

        {/* Role */}
        <div
          style={{
            fontSize: 28,
            color: "#a78bfa",
            fontWeight: 600,
            marginBottom: 24,
            display: "flex",
          }}
        >
          {profile.role}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 20,
            color: "#a1a1aa",
            lineHeight: 1.5,
            maxWidth: "75%",
            display: "flex",
          }}
        >
          {profile.tagline}
        </div>

        {/* URL badge */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            right: 60,
            fontSize: 16,
            color: "#52525b",
            fontFamily: "monospace",
            display: "flex",
          }}
        >
          sohelashik.com
        </div>
      </div>
    ),
    { ...size }
  );
}
