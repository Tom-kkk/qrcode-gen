"use client";

import { useState, useRef, useCallback, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { QrCodeImg } from "@/components/ui/QrCodeImg";

interface CreateQrModalProps {
  open: boolean;
  onClose: () => void;
  showToast: (message: string) => void;
}

const APP_ORIGIN =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function CreateQrModal({ open, onClose, showToast }: CreateQrModalProps) {
  const [title, setTitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const updatePreview = useCallback((code: string, url: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const c = code.trim() || "xxxxxx";
      if (url.trim()) {
        setPreviewUrl(`${APP_ORIGIN}/r/${c}`);
      } else {
        setPreviewUrl("");
      }
    }, 350);
  }, []);

  useEffect(() => {
    updatePreview(customCode, targetUrl);
  }, [customCode, targetUrl, updatePreview]);

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

  const reset = () => {
    setTitle("");
    setTargetUrl("");
    setCustomCode("");
    setPreviewUrl("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body: Record<string, string> = {
        title: title.trim(),
        target_url: targetUrl.trim(),
      };
      if (customCode.trim()) body.custom_code = customCode.trim();

      const res = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "创建失败，请重试");
        return;
      }

      handleClose();
      showToast("二维码创建成功！");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const previewCode = customCode.trim() || "xxxxxx";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="fade-in-up relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100"
          aria-label="关闭"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="font-heading mb-6 text-xl font-semibold" style={{ color: "var(--primary-dark)" }}>
          新建动态码
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="c-title">
                名称备注
              </label>
              <input
                id="c-title"
                type="text"
                placeholder="如：春季活动海报"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="auth-input w-full rounded-xl border px-4 py-3 text-sm transition-all duration-150 focus:outline-none"
                style={{ borderColor: "var(--nav-border)" }}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="c-url">
                目标网址
              </label>
              <input
                id="c-url"
                type="url"
                placeholder="https://example.com"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="auth-input w-full rounded-xl border px-4 py-3 text-sm transition-all duration-150 focus:outline-none"
                style={{ borderColor: "var(--nav-border)" }}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="c-code">
                自定义短码（可选）
              </label>
              <div
                className="flex items-stretch overflow-hidden rounded-xl border transition-all duration-150 focus-within:ring-2"
                style={{ borderColor: "var(--nav-border)" }}
              >
                <span
                  className="flex items-center border-r bg-gray-50 px-3 text-[10px] text-gray-400 whitespace-nowrap"
                  style={{ borderColor: "var(--nav-border)" }}
                >
                  /r/
                </span>
                <input
                  id="c-code"
                  type="text"
                  placeholder="自动生成"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="flex-1 px-3 py-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="primary-btn w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-white transition-colors duration-150 disabled:opacity-70"
            >
              {loading ? "创建中…" : "创建二维码"}
            </button>
          </form>

          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="w-full rounded-2xl bg-gray-50 p-5 flex flex-col items-center">
              <div className="mb-3 text-xs text-gray-400">实时预览</div>
              {previewUrl ? (
                <QrCodeImg value={previewUrl} size={144} />
              ) : (
                <div
                  className="flex h-36 w-36 items-center justify-center rounded-xl bg-white"
                  style={{ border: "1px dashed var(--nav-border)" }}
                >
                  <svg
                    className="h-10 w-10 text-gray-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <path d="M14 14h3v3M17 17h3v3M14 20h3" />
                  </svg>
                </div>
              )}
              <div
                className="mt-3 text-center font-mono text-xs font-bold"
                style={{ color: "var(--primary)" }}
              >
                /r/{previewCode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
