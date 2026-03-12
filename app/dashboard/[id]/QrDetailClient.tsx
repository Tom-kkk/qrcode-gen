"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { QrCode } from "@/types";

export function QrDetailClient({ qr: initial, appUrl }: { qr: QrCode; appUrl: string }) {
  const router = useRouter();
  const [qr, setQr] = useState(initial);
  const [targetUrl, setTargetUrl] = useState(qr.target_url);
  const [title, setTitle] = useState(qr.title ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const shortUrl = `${appUrl}/r/${qr.short_code}`;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/qrcodes/${qr.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl, title: title || undefined }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "保存失败");
        return;
      }
      setQr(json.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive() {
    const res = await fetch(`/api/qrcodes/${qr.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !qr.is_active }),
    });
    const json = await res.json();
    if (res.ok) {
      setQr(json.data);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm(`确定要删除"${qr.title ?? qr.short_code}"吗？此操作不可撤销。`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/qrcodes/${qr.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* 编辑表单 */}
      <div className="rounded-2xl border p-6 shadow-sm"
        style={{ background: "#fff", borderColor: "var(--nav-border)" }}>
        <h2 className="font-heading text-lg font-bold mb-4" style={{ color: "var(--primary-dark)" }}>
          编辑信息
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--foreground)" }}>
              名称
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：2026 春季活动"
              className="demo-input w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all"
              style={{ borderColor: "var(--nav-border)", color: "var(--foreground)" }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--foreground)" }}>
              目标 URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="demo-input w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all"
              style={{ borderColor: "var(--nav-border)", color: "var(--foreground)" }}
            />
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              修改后旧 URL 将记录到历史，二维码图片不需要重新印刷
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl px-5 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ background: "var(--primary)" }}
            >
              {saving ? "保存中…" : saved ? "✓ 已保存" : "保存更改"}
            </button>
          </div>
        </form>
      </div>

      {/* 短链信息 */}
      <div className="rounded-2xl border p-6 shadow-sm"
        style={{ background: "#fff", borderColor: "var(--nav-border)" }}>
        <h2 className="font-heading text-lg font-bold mb-4" style={{ color: "var(--primary-dark)" }}>
          短链信息
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span style={{ color: "var(--muted)" }}>短码</span>
            <code className="rounded-lg bg-purple-50 px-2 py-0.5 text-xs font-mono"
              style={{ color: "var(--primary)" }}>
              {qr.short_code}
            </code>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span style={{ color: "var(--muted)" }}>短链</span>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs hover:underline truncate max-w-xs" style={{ color: "var(--primary)" }}>
              {shortUrl}
            </a>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span style={{ color: "var(--muted)" }}>扫描次数</span>
            <strong style={{ color: "var(--foreground)" }}>{qr.scan_count.toLocaleString()}</strong>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span style={{ color: "var(--muted)" }}>状态</span>
            <button
              onClick={toggleActive}
              className="rounded-full px-3 py-0.5 text-xs font-medium transition-colors"
              style={{
                background: qr.is_active ? "rgba(34,197,94,0.1)" : "rgba(107,114,128,0.1)",
                color: qr.is_active ? "#16a34a" : "#6b7280",
              }}
            >
              {qr.is_active ? "● 已启用" : "○ 已停用"}
            </button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span style={{ color: "var(--muted)" }}>创建时间</span>
            <span style={{ color: "var(--foreground)" }}>
              {new Date(qr.created_at).toLocaleString("zh-CN")}
            </span>
          </div>
        </div>
      </div>

      {/* 操作区 */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/${qr.id}/stats`}
          className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-50"
          style={{ borderColor: "var(--nav-border)", color: "var(--primary)" }}
        >
          查看统计 →
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-xl px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
        >
          {deleting ? "删除中…" : "删除此码"}
        </button>
      </div>
    </div>
  );
}
