import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IVisit extends Document {
  path: string;
  referrer: string;
  country: string;
  browser: string;
  os: string;
  device: "Mobile" | "Desktop" | "Tablet";
  ip: string;           // last octet removed: 192.168.1.xxx
  userAgent: string;
  timestamp: Date;
}

const VisitSchema = new Schema<IVisit>(
  {
    path:      { type: String, required: true, index: true },
    referrer:  { type: String, default: "Direct" },
    country:   { type: String, default: "Unknown" },
    browser:   { type: String, default: "Other" },
    os:        { type: String, default: "Other" },
    device:    { type: String, enum: ["Mobile", "Desktop", "Tablet"], default: "Desktop" },
    ip:        { type: String, default: "" },
    userAgent: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false, versionKey: false }
);

// Compound index for time-range queries
VisitSchema.index({ timestamp: -1 });
VisitSchema.index({ path: 1, timestamp: -1 });

export const Visit: Model<IVisit> =
  (mongoose.models.Visit as Model<IVisit>) ||
  mongoose.model<IVisit>("Visit", VisitSchema);

// ─── UA Parser ───────────────────────────────────────────────────────────────

export function parseUserAgent(ua: string): {
  browser: string;
  os: string;
  device: "Mobile" | "Desktop" | "Tablet";
} {
  const u = ua.toLowerCase();

  const device: "Mobile" | "Desktop" | "Tablet" = /ipad|tablet|(android(?!.*mobile))/i.test(ua)
    ? "Tablet"
    : /mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)
    ? "Mobile"
    : "Desktop";

  const browser =
    /edg\//i.test(ua) ? "Edge" :
    /opr\/|opera/i.test(ua) ? "Opera" :
    /chrome/i.test(ua) && !/chromium/i.test(ua) ? "Chrome" :
    /chromium/i.test(ua) ? "Chromium" :
    /firefox|fxios/i.test(ua) ? "Firefox" :
    /safari/i.test(ua) && !/chrome/i.test(ua) ? "Safari" :
    /trident|msie/i.test(ua) ? "IE" :
    "Other";

  const os =
    /windows nt/i.test(ua) ? "Windows" :
    /mac os x|macos/i.test(ua) && !/iphone|ipad/i.test(ua) ? "macOS" :
    /android/i.test(ua) ? "Android" :
    /iphone|ipad|ipod/i.test(ua) ? "iOS" :
    /linux/i.test(ua) ? "Linux" :
    /chromeos|cros/i.test(ua) ? "ChromeOS" :
    "Other";

  void u; // suppress unused warning
  return { browser, os, device };
}

export function anonymizeIp(ip: string): string {
  // IPv4: remove last octet. IPv6: remove last group.
  const v4 = ip.match(/^(\d+\.\d+\.\d+)\.\d+$/);
  if (v4) return `${v4[1]}.xxx`;
  const v6 = ip.match(/^(.*:)[^:]+$/);
  if (v6) return `${v6[1]}xxxx`;
  return "xxx";
}

export function parseReferrer(ref: string, currentHost: string): string {
  if (!ref) return "Direct";
  try {
    const url = new URL(ref);
    if (url.hostname === currentHost) return "Internal";
    // Prettify common referrers
    const hostname = url.hostname.replace(/^www\./, "");
    return hostname;
  } catch {
    return "Direct";
  }
}
