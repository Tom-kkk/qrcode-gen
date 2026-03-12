"use client";

import { useStats } from "@/hooks/useStats";

const PERIODS = [
  { label: "7 天", value: "7d" },
  { label: "30 天", value: "30d" },
  { label: "90 天", value: "90d" },
] as const;

export function StatsClient({
  qrCodeId,
  qrTitle,
}: {
  qrCodeId: string;
  qrTitle: string;
}) {
  const { overview, timeline, devices, isLoading, error, period, setPeriod } =
    useStats(qrCodeId);

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-bold" style={{ color: "var(--primary-dark)" }}>
        {qrTitle} — 统计数据
      </h1>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          加载失败：{error.message}
        </div>
      )}

      {/* 概览指标 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "总扫描次数", value: overview?.total_scans?.toLocaleString() ?? "—" },
          { label: "今日扫描", value: overview?.today_scans?.toLocaleString() ?? "—" },
          { label: "独立 IP", value: overview?.unique_ips?.toLocaleString() ?? "—" },
          {
            label: "最近扫描",
            value: overview?.last_scanned_at
              ? new Date(overview.last_scanned_at).toLocaleDateString("zh-CN")
              : "—",
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border p-5 shadow-sm"
            style={{ background: "#fff", borderColor: "var(--nav-border)" }}
          >
            <p className="text-xs" style={{ color: "var(--muted)" }}>{label}</p>
            <p className="mt-1 font-heading text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              {isLoading ? "…" : value}
            </p>
          </div>
        ))}
      </div>

      {/* 时间线 */}
      <div className="rounded-2xl border p-6 shadow-sm"
        style={{ background: "#fff", borderColor: "var(--nav-border)" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold" style={{ color: "var(--primary-dark)" }}>
            扫描趋势
          </h2>
          <div className="flex gap-1">
            {PERIODS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className="rounded-lg px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  background: period === value ? "var(--primary)" : "transparent",
                  color: period === value ? "#fff" : "var(--muted)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm" style={{ color: "var(--muted)" }}>
            加载中…
          </div>
        ) : timeline.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm" style={{ color: "var(--muted)" }}>
            暂无扫描数据
          </div>
        ) : (
          <SimpleBarChart data={timeline} />
        )}
      </div>

      {/* 设备分布 */}
      <div className="rounded-2xl border p-6 shadow-sm"
        style={{ background: "#fff", borderColor: "var(--nav-border)" }}>
        <h2 className="font-heading text-base font-semibold mb-4" style={{ color: "var(--primary-dark)" }}>
          设备分布
        </h2>
        {isLoading ? (
          <div className="text-sm" style={{ color: "var(--muted)" }}>加载中…</div>
        ) : devices.length === 0 ? (
          <div className="text-sm" style={{ color: "var(--muted)" }}>暂无数据</div>
        ) : (
          <div className="space-y-3">
            {devices.map((d) => (
              <div key={d.device_type} className="flex items-center gap-3">
                <span className="w-16 text-xs capitalize" style={{ color: "var(--muted)" }}>
                  {d.device_type}
                </span>
                <div className="flex-1 rounded-full bg-purple-50 h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${d.percentage}%`, background: "var(--primary)" }}
                  />
                </div>
                <span className="w-12 text-right text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  {d.percentage}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SimpleBarChart({ data }: { data: { date: string; scans: number }[] }) {
  const max = Math.max(...data.map((d) => d.scans), 1);
  return (
    <div className="flex items-end gap-1 h-40 overflow-x-auto pb-6 relative">
      {data.map((d) => {
        const height = Math.max((d.scans / max) * 100, 2);
        return (
          <div key={d.date} className="group flex flex-col items-center flex-1 min-w-[20px]">
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: `${height}%`,
                background: "var(--primary)",
                opacity: 0.8,
              }}
              title={`${d.date}: ${d.scans} 次`}
            />
            <span className="mt-1 text-[9px] rotate-45 origin-top-left truncate w-6"
              style={{ color: "var(--muted)" }}>
              {d.date.slice(5)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
