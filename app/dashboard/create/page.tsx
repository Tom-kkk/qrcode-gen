"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateQrPage() {
  const router = useRouter();
  const [targetUrl, setTargetUrl] = useState("");
  const [title, setTitle] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    shortCode: string;
    shortUrl: string;
    qrCodeSvg: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl,
          title: title || undefined,
          shortCode: shortCode || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "创建失败");
        return;
      }
      setResult({ shortCode: json.shortCode, shortUrl: json.shortUrl, qrCodeSvg: json.qrCodeSvg });
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <main className="mx-auto max-w-lg px-4 py-10 text-center">
          <div className="rounded-2xl border p-8 shadow-sm"
            style={{ background: "#fff", borderColor: "var(--nav-border)" }}>
            <div className="mx-auto mb-4 h-6 w-6 text-green-500">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-heading text-xl font-bold" style={{ color: "var(--primary-dark)" }}>
              二维码创建成功！
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>短码：{result.shortCode}</p>

            {/* SVG 二维码预览 */}
            <div
              className="mx-auto mt-6 flex h-52 w-52 items-center justify-center rounded-2xl border p-3"
              style={{ borderColor: "var(--nav-border)" }}
              dangerouslySetInnerHTML={{ __html: result.qrCodeSvg }}
            />

            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-sm hover:underline"
              style={{ color: "var(--primary)" }}
            >
              {result.shortUrl}
            </a>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setResult(null);
                  setTargetUrl("");
                  setTitle("");
                  setShortCode("");
                }}
                className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-50"
                style={{ borderColor: "var(--nav-border)", color: "var(--primary)" }}
              >
                再创建一个
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >
                返回列表
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="mb-6 flex items-center gap-2">
          <Link href="/dashboard" className="text-sm hover:underline" style={{ color: "var(--muted)" }}>
            管理台
          </Link>
          <span style={{ color: "var(--muted)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>新建二维码</span>
        </div>

        <div className="rounded-2xl border p-8 shadow-sm"
          style={{ background: "#fff", borderColor: "var(--nav-border)" }}>
          <h1 className="font-heading text-xl font-bold mb-6" style={{ color: "var(--primary-dark)" }}>
            创建动态二维码
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--foreground)" }}>
                目标 URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com/landing-page"
                className="demo-input w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all"
                style={{ borderColor: "var(--nav-border)", color: "var(--foreground)" }}
              />
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                扫码后跳转的目标地址，后续可随时修改
              </p>
            </div>

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
                自定义短码
              </label>
              <input
                type="text"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
                placeholder="留空则自动生成（如 aB3xYz12）"
                pattern="[a-zA-Z0-9_\-]{3,32}"
                className="demo-input w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all"
                style={{ borderColor: "var(--nav-border)", color: "var(--foreground)" }}
              />
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                3-32 位字母、数字、-、_，留空自动生成
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ background: "var(--primary)" }}
            >
              {loading ? "生成中…" : "生成二维码"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
