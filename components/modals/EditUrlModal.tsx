"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface EditUrlModalProps {
  open: boolean;
  qrCodeId: string;
  shortCode: string;
  currentUrl: string;
  onClose: () => void;
  showToast: (message: string) => void;
}

export function EditUrlModal({
  open,
  qrCodeId,
  shortCode,
  currentUrl,
  onClose,
  showToast,
}: EditUrlModalProps) {
  const [newUrl, setNewUrl] = useState(currentUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setNewUrl(currentUrl);
    setError("");
  }, [open, currentUrl]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/qrcodes/${qrCodeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_url: newUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "修改失败，请重试");
        return;
      }

      onClose();
      showToast("目标 URL 已更新");
      router.refresh();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="fade-in-up relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100"
          aria-label="关闭"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="font-heading text-xl font-semibold" style={{ color: "var(--primary-dark)" }}>
          修改目标 URL
        </h2>
        <p className="mb-5 mt-1 text-sm" style={{ color: "var(--muted)" }}>
          二维码图形不变，立即更新跳转目标
        </p>

        {/* Short URL */}
        <div className="mb-5 rounded-xl bg-gray-50 px-4 py-3">
          <div className="mb-0.5 text-xs text-gray-400">短链接</div>
          <div className="font-mono text-sm font-bold" style={{ color: "var(--primary)" }}>
            /r/{shortCode}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="edit-url">
              新目标网址
            </label>
            <input
              id="edit-url"
              type="url"
              placeholder="https://new-target.com"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="auth-input w-full rounded-xl border px-4 py-3 text-sm transition-all duration-150 focus:outline-none"
              style={{ borderColor: "var(--nav-border)" }}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-xl border py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              style={{ borderColor: "var(--nav-border)" }}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="primary-btn flex-1 cursor-pointer rounded-xl py-3 text-sm font-semibold text-white transition-colors duration-150 disabled:opacity-70"
            >
              {loading ? "保存中…" : "保存修改"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
