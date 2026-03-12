import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/app-url";
import type { QrCode } from "@/types";

function QrCodeCard({ qr, appUrl }: { qr: QrCode; appUrl: string }) {
  const shortUrl = `${appUrl}/r/${qr.short_code}`;
  return (
    <div
      className="group rounded-2xl border p-5 transition-shadow hover:shadow-md"
      style={{ background: "#fff", borderColor: "var(--nav-border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="font-heading text-sm font-semibold truncate"
              style={{ color: "var(--primary-dark)" }}
            >
              {qr.title ?? qr.short_code}
            </span>
            {!qr.is_active && (
              <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                已停用
              </span>
            )}
          </div>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 block text-xs truncate hover:underline"
            style={{ color: "var(--primary)" }}
          >
            {shortUrl}
          </a>
          <p className="mt-1 text-xs truncate" style={{ color: "var(--muted)" }}>
            → {qr.target_url}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            {qr.scan_count.toLocaleString()}
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>次扫描</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {new Date(qr.created_at).toLocaleDateString("zh-CN")}
        </span>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/${qr.id}`}
            className="rounded-lg px-3 py-1 text-xs font-medium transition-colors hover:bg-purple-50"
            style={{ color: "var(--primary)" }}
          >
            编辑
          </Link>
          <Link
            href={`/dashboard/${qr.id}/stats`}
            className="rounded-lg px-3 py-1 text-xs font-medium transition-colors hover:bg-purple-50"
            style={{ color: "var(--primary)" }}
          >
            统计
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: qrCodes } = await supabase
    .from("qr_codes")
    .select("*")
    .order("created_at", { ascending: false });

  const appUrl = getAppUrl();
  const list = (qrCodes ?? []) as QrCode[];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* 页头 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: "var(--primary-dark)" }}>
              我的二维码
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              共 {list.length} 个
            </p>
          </div>
          <Link
            href="/dashboard/create"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            + 新建二维码
          </Link>
        </div>

        {/* 列表 */}
        {list.length === 0 ? (
          <div className="rounded-2xl border py-20 text-center"
            style={{ borderColor: "var(--nav-border)", background: "#fff" }}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "rgba(124,58,237,0.08)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.2" />
                <rect x="14" y="3" width="7" height="7" rx="1.2" />
                <rect x="3" y="14" width="7" height="7" rx="1.2" />
                <path d="M14 14h3v3M17 17h3v3M14 20h3" />
              </svg>
            </div>
            <p className="font-heading text-base font-semibold" style={{ color: "var(--foreground)" }}>
              还没有二维码
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              创建第一个动态二维码，开始追踪数据
            </p>
            <Link
              href="/dashboard/create"
              className="mt-4 inline-block rounded-xl px-5 py-2 text-sm font-semibold text-white"
              style={{ background: "var(--primary)" }}
            >
              立即创建
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((qr) => (
              <QrCodeCard key={qr.id} qr={qr} appUrl={appUrl} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
