"use client";

import { useApp } from "@/app/providers";
import { QrCodeImg } from "@/components/ui/QrCodeImg";

const HERO_QR_URL = "https://dynaQR.io/r/spring26";
const SHORT_CODE = "dynaQR.io/r/spring26";

const STATS = [
  { value: "1,284", label: "总扫描" },
  { value: "42",    label: "今日",  border: true },
  { value: "18",    label: "城市" },
] as const;

export function HeroQRCard() {
  const { showToast } = useApp();

  const handleCopy = () => {
    navigator.clipboard?.writeText(SHORT_CODE)
      .then(() => showToast("已复制到剪贴板"))
      .catch(() => showToast("复制成功"));
  };

  return (
    <div
      className="fade-in-up flex justify-center lg:justify-end"
      style={{ animationDelay: "0.12s" }}
    >
      <div className="relative">
        {/* 紫色光晕背景 */}
        <div
          className="absolute -inset-5 -z-10 rounded-3xl"
          style={{ background: "rgba(167,139,250,.15)" }}
          aria-hidden
        />

        {/* 卡片本体 */}
        <div
          className="w-80 rounded-2xl border bg-white p-6 sm:w-[22rem]"
          style={{ borderColor: "var(--nav-border)" }}
        >
          {/* 头部 */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="mb-0.5 text-xs font-medium text-gray-400">动态二维码</div>
              <div
                className="font-heading text-sm font-bold"
                style={{ color: "var(--primary-dark)" }}
              >
                春季推广活动
              </div>
            </div>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-600">
              启用中
            </span>
          </div>

          {/* QR 预览 + 扫描动画环 */}
          <div className="mb-4 flex justify-center">
            <div className="relative inline-block">
              <QrCodeImg value={HERO_QR_URL} size={192} />
              <div
                className="scan-ring pointer-events-none absolute inset-0 rounded-xl border-2"
                style={{ borderColor: "rgba(124,58,237,.25)" }}
                aria-hidden
              />
            </div>
          </div>

          {/* 短链接行 */}
          <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5">
            <div>
              <div className="mb-0.5 text-[10px] text-gray-400">短链接</div>
              <div
                className="font-mono text-sm font-bold"
                style={{ color: "var(--primary)" }}
              >
                {SHORT_CODE}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="cursor-pointer text-gray-400 transition-colors duration-150 hover:text-[var(--primary)]"
              title="复制短链接"
              aria-label="复制短链接"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </button>
          </div>

          {/* 目标 URL */}
          <div className="mb-4 flex min-w-0 items-center gap-1.5 text-xs text-gray-400">
            <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.7" />
            </svg>
            <span className="truncate">https://example.com/spring-sale-2026</span>
          </div>

          {/* 统计数字 */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            {STATS.map(({ value, label, ...rest }) => (
              <div
                key={label}
                className={`text-center ${"border" in rest && rest.border ? "border-x border-gray-100" : ""}`}
              >
                <div
                  className="font-heading text-lg font-bold"
                  style={{ color: "var(--primary-dark)" }}
                >
                  {value}
                </div>
                <div className="text-[10px] text-gray-400">{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
