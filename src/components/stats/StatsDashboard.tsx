"use client";

import { useState } from "react";
import { Globe, Monitor, Smartphone, Tablet, TrendingUp, Users, Eye, ExternalLink } from "lucide-react";

interface StatsData {
  overview: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  daily: { date: string; count: number }[];
  topPages: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  countries: { country: string; count: number }[];
  browsers: { browser: string; count: number }[];
  devices: { device: string; count: number }[];
  recent: { path: string; country: string; browser: string; device: string; timestamp: string }[];
  blogViews: { title: string; slug: string; views: number }[];
}

interface Props {
  data: StatsData;
}

function BarChart({ items, maxVal }: { items: { label: string; count: number }[]; maxVal: number }) {
  return (
    <div className="space-y-2">
      {items.map(({ label, count }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="w-32 truncate text-xs text-[var(--color-muted-foreground)] text-right flex-shrink-0">{label}</span>
          <div className="flex-1 h-5 rounded bg-[var(--color-background)] overflow-hidden">
            <div
              className="h-full rounded bg-[var(--color-accent)]/60 transition-all duration-500"
              style={{ width: `${maxVal > 0 ? Math.round((count / maxVal) * 100) : 0}%` }}
            />
          </div>
          <span className="w-8 text-right text-xs font-mono text-[var(--color-foreground)]">{count}</span>
        </div>
      ))}
    </div>
  );
}

function DailyChart({ daily }: { daily: { date: string; count: number }[] }) {
  const max = Math.max(...daily.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-0.5 h-24 w-full">
      {daily.map(({ date, count }) => (
        <div key={date} className="group relative flex-1 flex flex-col items-center justify-end h-full">
          <div
            className="w-full rounded-t bg-[var(--color-accent)]/50 hover:bg-[var(--color-accent)] transition-colors"
            style={{ height: `${Math.round((count / max) * 100)}%`, minHeight: count > 0 ? 3 : 0 }}
          />
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 hidden group-hover:block text-[9px] bg-[var(--color-background)] border border-[var(--color-border)] rounded px-1 py-0.5 whitespace-nowrap z-10 font-mono">
            {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}: {count}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wide">{label}</span>
        <Icon size={14} className="text-[var(--color-accent)]" />
      </div>
      <p className="text-3xl font-bold font-mono text-[var(--color-accent)]">{value}</p>
    </div>
  );
}

const DEVICE_ICONS: Record<string, React.ElementType> = {
  Mobile: Smartphone,
  Desktop: Monitor,
  Tablet: Tablet,
};

export function StatsDashboard({ data }: Props) {
  const [period, setPeriod] = useState<"week" | "month">("month");

  const dailyFiltered = period === "week" ? data.daily.slice(-7) : data.daily;
  const maxDaily = Math.max(...dailyFiltered.map((d) => d.count), 1);

  const totalDevices = data.devices.reduce((s, d) => s + d.count, 0);

  return (
    <div className="min-h-screen pt-20 pb-16 px-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] mb-1">Analytics</p>
          <h1 className="text-2xl font-bold tracking-tight">Site Stats</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Real visitors — no cookies, no third-party trackers.</p>
        </div>

        {/* Overview cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Today" value={data.overview.today} icon={TrendingUp} />
          <StatCard label="This week" value={data.overview.week} icon={Users} />
          <StatCard label="This month" value={data.overview.month} icon={Eye} />
          <StatCard label="All time" value={data.overview.total} icon={Globe} />
        </div>

        {/* Daily chart */}
        <div className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Visits over time</h2>
            <div className="flex gap-1">
              {(["week", "month"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-md px-2.5 py-1 text-xs transition-colors ${period === p ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"}`}
                >
                  {p === "week" ? "7d" : "30d"}
                </button>
              ))}
            </div>
          </div>
          <DailyChart daily={dailyFiltered} />
          {/* X-axis labels */}
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[var(--color-muted)] font-mono">
              {dailyFiltered[0] ? new Date(dailyFiltered[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
            </span>
            <span className="text-[10px] text-[var(--color-muted)] font-mono">
              {dailyFiltered[dailyFiltered.length - 1]
                ? new Date(dailyFiltered[dailyFiltered.length - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : ""}
            </span>
          </div>
        </div>

        {/* 3-column grid */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Top pages */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-semibold mb-4">Top pages</h2>
            <BarChart
              items={data.topPages.map((p) => ({ label: p.path, count: p.count }))}
              maxVal={data.topPages[0]?.count ?? 1}
            />
          </div>

          {/* Top referrers */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-semibold mb-4">Referrers</h2>
            <BarChart
              items={data.topReferrers.map((r) => ({ label: r.referrer, count: r.count }))}
              maxVal={data.topReferrers[0]?.count ?? 1}
            />
          </div>

          {/* Countries */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-semibold mb-4">Countries</h2>
            <BarChart
              items={data.countries.slice(0, 8).map((c) => ({ label: c.country, count: c.count }))}
              maxVal={data.countries[0]?.count ?? 1}
            />
          </div>
        </div>

        {/* Browsers + Devices + Blog views */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Browsers */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-semibold mb-4">Browsers</h2>
            <BarChart
              items={data.browsers.map((b) => ({ label: b.browser, count: b.count }))}
              maxVal={data.browsers[0]?.count ?? 1}
            />
          </div>

          {/* Devices */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-semibold mb-4">Devices</h2>
            <div className="space-y-3">
              {data.devices.map(({ device, count }) => {
                const Icon = DEVICE_ICONS[device] ?? Monitor;
                const pct = totalDevices > 0 ? Math.round((count / totalDevices) * 100) : 0;
                return (
                  <div key={device} className="flex items-center gap-3">
                    <Icon size={14} className="text-[var(--color-accent)] flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--color-muted-foreground)]">{device}</span>
                        <span className="font-mono text-[var(--color-foreground)]">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded bg-[var(--color-background)]">
                        <div className="h-full rounded bg-[var(--color-accent)]/60" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blog post views */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-semibold mb-4">Blog post views</h2>
            {data.blogViews.length === 0 ? (
              <p className="text-xs text-[var(--color-muted)]">No published posts yet.</p>
            ) : (
              <div className="space-y-3">
                {data.blogViews.map((p) => (
                  <div key={p.slug} className="flex items-center justify-between gap-2">
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)] truncate flex items-center gap-1">
                      <ExternalLink size={10} className="flex-shrink-0" />
                      {p.title}
                    </a>
                    <span className="font-mono text-xs text-[var(--color-foreground)] flex-shrink-0">{p.views}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent visits */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold">Recent visits</h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {data.recent.length === 0 && (
              <p className="px-5 py-4 text-xs text-[var(--color-muted)]">No visits yet.</p>
            )}
            {data.recent.map((v, i) => (
              <div key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-xs hover:bg-[var(--color-surface-elevated)] transition-colors">
                <span className="font-mono text-[var(--color-foreground)] min-w-32 truncate">{v.path}</span>
                <span className="text-[var(--color-muted-foreground)]">{v.country}</span>
                <span className="text-[var(--color-muted-foreground)]">{v.browser}</span>
                <span className="text-[var(--color-muted-foreground)]">{v.device}</span>
                <span className="ml-auto text-[var(--color-muted)] font-mono">
                  {new Date(v.timestamp).toLocaleString("en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
