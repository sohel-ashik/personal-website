import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "blog_session";
const SESSION_SECRET = process.env.BLOG_SESSION_SECRET ?? "dev-secret-not-secure";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hmac(data: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
}

export function signSession(): string {
  const ts = Date.now().toString();
  return `${ts}.${hmac(ts)}`;
}

export function verifySession(value: string): boolean {
  const dot = value.lastIndexOf(".");
  if (dot === -1) return false;
  const ts = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  // Check signature
  if (sig !== hmac(ts)) return false;
  // Check TTL
  if (Date.now() - parseInt(ts, 10) > TTL_MS) return false;
  return true;
}

export function setSessionCookie(response: NextResponse): void {
  const value = signSession();
  response.cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TTL_MS / 1000,
    path: "/",
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

/** Use in Server Components — reads cookie store directly */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const store = await cookies();
    const cookie = store.get(COOKIE_NAME);
    if (!cookie) return false;
    return verifySession(cookie.value);
  } catch {
    return false;
  }
}

/** Use in Route Handlers — reads from NextRequest */
export function isAuthenticatedFromRequest(req: NextRequest): boolean {
  const cookie = req.cookies.get(COOKIE_NAME);
  if (!cookie) return false;
  return verifySession(cookie.value);
}

/** Throws a 401 response if not authenticated */
export function requireAuth(req: NextRequest): void {
  if (!isAuthenticatedFromRequest(req)) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
