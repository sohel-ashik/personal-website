import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  subject: z.string().max(120).optional().default(""),
  message: z.string().min(10).max(2000),
  honeypot: z.string().max(0).optional(),
});

// Simple in-memory rate limiter: max 3 requests per minute per IP
const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }

  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed.", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, subject, message, honeypot } = parsed.data;

  // Honeypot check
  if (honeypot && honeypot.length > 0) {
    return NextResponse.json({ success: true });
  }

  const result = await sendContactEmail({ name, email, subject, message });

  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
