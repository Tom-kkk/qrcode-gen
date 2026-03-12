"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { QrCode } from "@/types";
import { QrCodeImg } from "@/components/ui/QrCodeImg";
import { QrCodePreviewModal } from "@/components/ui/QrCodePreviewModal";
import { Toast } from "@/components/ui/Toast";

interface QrCodeCardProps {
  qr: QrCode;
  appUrl: string;
}

export function QrCodeCard({ qr, appUrl }: QrCodeCardProps) {
  const shortUrl = `${appUrl}/r/${qr.short_code}`;
  const scanCount = qr.scan_count ?? 0;
  const isActive = qr.is_active !== false;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const handleCopy = useCallback((_url: string) => {
    setToastMsg("短链已复制到剪贴板");
    setToastVisible(true);
  }, []);

  return (
    <>
      <div
        className="group rounded-2xl border p-5 transition-shadow hover:shadow-md"
        style={{ background: "#fff", borderColor: "var(--nav-border)" }}
      >
        <div className="flex items-start gap-4">
          {/* 缩略图 — 点击打开全图预览 */}
          <button
            type="button"
            aria-label={`预览 ${qr.title ?? qr.short_code} 的二维码`}
            onClick={() => setPreviewOpen(true)}
            className="flex-shrink-0 rounded-xl transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <QrCodeImg value={shortUrl} size={80} className="rounded-lg pointer-events-none" />
          </button>

          <div className="min-w-0 flex-1">
            {/* 标题 + 状态 */}
            <div className="flex items-center gap-2">
              <span
                className="font-heading text-sm font-semibold truncate"
                style={{ color: "var(--primary-dark)" }}
              >
                {qr.title ?? qr.short_code}
              </span>
              {!isActive && (
                <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  已停用
                </span>
              )}
            </div>

            {/* 短链 */}
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 block text-xs truncate hover:underline"
              style={{ color: "var(--primary)" }}
            >
              {shortUrl}
            </a>

            {/* 目标链接 */}
            <p className="mt-1 text-xs truncate" style={{ color: "var(--muted)" }}>
              → {qr.target_url}
            </p>
          </div>

          {/* 扫描次数 */}
          <div className="flex-shrink-0 text-right">
            <div className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              {scanCount.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>次扫描</div>
          </div>
        </div>

        {/* 底部：日期 + 操作 */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {new Date(qr.created_at).toLocaleDateString("zh-CN")}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="rounded-lg px-3 py-1 text-xs font-medium transition-colors hover:bg-purple-50"
              style={{ color: "var(--primary)" }}
            >
              查看
            </button>
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

      {/* 全图预览弹窗 */}
      <QrCodePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={qr.title}
        shortCode={qr.short_code}
        shortUrl={shortUrl}
        targetUrl={qr.target_url}
        onCopy={handleCopy}
      />

      {/* 复制成功提示 */}
      <Toast
        visible={toastVisible}
        message={toastMsg}
        onHide={() => setToastVisible(false)}
      />
    </>
  );
}
