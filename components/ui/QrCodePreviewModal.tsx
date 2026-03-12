"use client";

import { useEffect, useCallback, useRef } from "react";
import { QrCodeImg } from "@/components/ui/QrCodeImg";

interface QrCodePreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string | null;
  shortCode: string;
  shortUrl: string;
  targetUrl: string;
  onCopy?: (text: string) => void;
}

export function QrCodePreviewModal({
  open,
  onClose,
  title,
  shortCode,
  shortUrl,
  targetUrl,
  onCopy,
}: QrCodePreviewModalProps) {
  const qrRef = useRef<HTMLImageElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const handleDownload = () => {
    const img = document.getElementById("qr-preview-img") as HTMLImageElement | null;
    if (!img) return;
    const a = document.createElement("a");
    a.href = img.src;
    a.download = `${shortCode}.png`;
    a.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      onCopy?.(shortUrl);
    } catch {
      /* 不支持 clipboard API 时静默失败 */
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${title ?? shortCode} 二维码预览`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 弹窗主体 */}
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl shadow-2xl"
        style={{ background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部标题栏 */}
        <div
          className="flex items-center justify-between px-5 pt-5 pb-4"
          style={{ borderBottom: "1px solid var(--nav-border)" }}
        >
          <div className="min-w-0">
            <h2
              className="font-heading text-base font-bold truncate"
              style={{ color: "var(--primary-dark)" }}
            >
              {title ?? shortCode}
            </h2>
            <p className="mt-0.5 text-xs truncate" style={{ color: "var(--muted)" }}>
              {targetUrl}
            </p>
          </div>
          <button
            type="button"
            aria-label="关闭预览"
            onClick={onClose}
            className="ml-3 flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: "var(--muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 二维码展示区 */}
        <div className="flex flex-col items-center px-5 py-6">
          <div
            className="rounded-2xl p-4 shadow-sm"
            style={{ background: "rgba(124,58,237,0.04)", border: "1px solid var(--nav-border)" }}
          >
            <QrCodeImg
              value={shortUrl}
              size={256}
              ecLevel="M"
              imgId="qr-preview-img"
              imgRef={qrRef}
            />
          </div>

          {/* 短链 + 复制 */}
          <div
            className="mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: "rgba(124,58,237,0.05)", border: "1px solid var(--nav-border)" }}
          >
            <span
              className="min-w-0 flex-1 truncate text-xs font-medium"
              style={{ color: "var(--primary)" }}
            >
              {shortUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="复制短链"
              className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-purple-100"
              style={{ color: "var(--primary)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div
          className="flex gap-3 px-5 pb-5"
          style={{ borderTop: "1px solid var(--nav-border)", paddingTop: "1rem" }}
        >
          <button
            type="button"
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            下载 PNG
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100"
            style={{ color: "var(--muted)", border: "1px solid var(--nav-border)" }}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
