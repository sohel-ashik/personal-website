import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/blog-auth";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Visit } from "@/lib/models/Visit";
import { Post } from "@/lib/models/Post";
import { AuthGate } from "@/components/blog/AuthGate";
import { StatsDashboard } from "@/components/stats/StatsDashboard";

export const metadata = {
  title: "Stats",
  robots: { index: false, follow: false },
};

// Helpers
function startOf(unit: "day" | "week" | "month"): Date {
  const now = new Date();
  if (unit === "day") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (unit === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function topN<T extends Record<string, string>>(
  arr: T[],
  key: keyof T,
  n = 10
): { [k: string]: string | number }[] {
  const counts: Record<string, number> = {};
  for (const item of arr) counts[item[key] as string] = (counts[item[key] as string] ?? 0) + 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([val, count]) => ({ [key as string]: val, count }));
}

async function getStatsData() {
  if (!isDBConfigured) {
    return {
      overview: { today: 0, week: 0, month: 0, total: 0 },
      daily: [],
      topPages: [],
      topReferrers: [],
      countries: [],
      browsers: [],
      devices: [],
      recent: [],
      blogViews: [],
    };
  }

  await connectDB();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [todayCount, weekCount, monthCount, totalCount] = await Promise.all([
    Visit.countDocuments({ timestamp: { $gte: startOf("day") } }),
    Visit.countDocuments({ timestamp: { $gte: startOf("week") } }),
    Visit.countDocuments({ timestamp: { $gte: startOf("month") } }),
    Visit.countDocuments(),
  ]);

  // Last 30 days daily breakdown
  const dailyRaw = await Visit.aggregate([
    { $match: { timestamp: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: {
          y: { $year: "$timestamp" },
          m: { $month: "$timestamp" },
          d: { $dayOfMonth: "$timestamp" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
  ]);

  // Fill in missing days with 0
  const dailyMap: Record<string, number> = {};
  for (const d of dailyRaw) {
    const key = `${d._id.y}-${String(d._id.m).padStart(2, "0")}-${String(d._id.d).padStart(2, "0")}`;
    dailyMap[key] = d.count;
  }
  const daily: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    daily.push({ date: key, count: dailyMap[key] ?? 0 });
  }

  // Top pages
  const pagesRaw = await Visit.aggregate([
    { $group: { _id: "$path", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  const topPages = pagesRaw.map((p) => ({ path: p._id as string, count: p.count as number }));

  // Referrers
  const refRaw = await Visit.aggregate([
    { $group: { _id: "$referrer", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  const topReferrers = refRaw.map((r) => ({ referrer: r._id as string, count: r.count as number }));

  // Countries
  const countryRaw = await Visit.aggregate([
    { $group: { _id: "$country", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  const countries = countryRaw.map((c) => ({ country: c._id as string, count: c.count as number }));

  // Browsers
  const browserRaw = await Visit.aggregate([
    { $group: { _id: "$browser", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const browsers = browserRaw.map((b) => ({ browser: b._id as string, count: b.count as number }));

  // Devices
  const deviceRaw = await Visit.aggregate([
    { $group: { _id: "$device", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const devices = deviceRaw.map((d) => ({ device: d._id as string, count: d.count as number }));

  // Recent 50 visits
  const recentRaw = await Visit.find()
    .sort({ timestamp: -1 })
    .limit(50)
    .select("path country browser device timestamp")
    .lean();

  const recent = recentRaw.map((v) => ({
    path: v.path,
    country: v.country,
    browser: v.browser,
    device: v.device,
    timestamp: v.timestamp.toISOString(),
  }));

  // Blog post views
  const posts = await Post.find({ published: true })
    .sort({ views: -1 })
    .select("title slug views")
    .lean();
  const blogViews = posts.map((p) => ({ title: p.title, slug: p.slug, views: p.views ?? 0 }));

  return {
    overview: { today: todayCount, week: weekCount, month: monthCount, total: totalCount },
    daily,
    topPages,
    topReferrers,
    countries,
    browsers,
    devices,
    recent,
    blogViews,
  };
}

export default async function StatsPage() {
  const authed = await isAuthenticated();
  if (!authed) return <AuthGate />;

  const data = await getStatsData();
  return <StatsDashboard data={data} />;
}
