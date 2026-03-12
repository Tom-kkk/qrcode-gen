import { SectionHeader } from "@/app/components/ui/SectionHeader";

const EC_LEVELS = ["低 L", "中 M", "高 Q", "极高 H"] as const;

function DemoQRPlaceholder() {
  return (
    <div
      className="h-48 w-48 rounded-xl bg-white border flex items-center justify-center"
      style={{ borderColor: "var(--nav-border)" }}
    >
      <svg
        className="h-20 w-20 text-gray-200"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-label="二维码预览占位"
        role="img"
      >
        <rect x="3"  y="3"  width="7" height="7" rx="1" />
        <rect x="14" y="3"  width="7" height="7" rx="1" />
        <rect x="3"  y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3M17 17h3v3M14 20h3" />
      </svg>
    </div>
  );
}

function DemoForm() {
  return (
    <div className="space-y-4">
      {/* 目标网址 */}
      <div>
        <label
          htmlFor="demo-url"
          className="mb-1.5 block text-sm font-medium"
          style={{ color: "var(--muted-strong)" }}
        >
          目标网址
        </label>
        <input
          id="demo-url"
          type="url"
          placeholder="https://example.com"
          defaultValue="https://dynaQR.io/r/demo"
          className="demo-input w-full rounded-xl border px-4 py-3 text-sm transition-all duration-150 focus:outline-none"
          style={{ borderColor: "var(--nav-border)" }}
        />
      </div>

      {/* 自定义短码 */}
      <div>
        <label
          htmlFor="demo-code"
          className="mb-1.5 block text-sm font-medium"
          style={{ color: "var(--muted-strong)" }}
        >
          自定义短码（可选）
        </label>
        <div
          className="flex items-stretch overflow-hidden rounded-xl border transition-all duration-150 focus-within:ring-2"
          style={{ borderColor: "var(--nav-border)" }}
        >
          <span
            className="flex items-center border-r bg-gray-50 px-3 text-xs whitespace-nowrap text-gray-400"
            style={{ borderColor: "var(--nav-border)" }}
          >
            dynaQR.io/r/
          </span>
          <input
            id="demo-code"
            type="text"
            placeholder="my-code"
            defaultValue="demo"
            className="flex-1 px-3 py-3 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* 纠错级别 */}
      <div>
        <span
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--muted-strong)" }}
        >
          纠错级别
        </span>
        <div className="flex gap-1.5">
          {EC_LEVELS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={`flex-1 cursor-pointer rounded-lg py-2 text-xs transition-colors duration-150 focus:outline-none ${
                i === 1
                  ? "border-2 font-semibold"
                  : "border hover:border-[var(--primary)] hover:text-[var(--primary)]"
              }`}
              style={
                i === 1
                  ? { borderColor: "var(--primary)", color: "var(--primary)" }
                  : { borderColor: "var(--nav-border)", color: "var(--muted)" }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        className="cta-btn mt-2 w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-white transition-colors duration-150 focus:outline-none hover:opacity-90"
      >
        注册并保存此二维码
      </button>
    </div>
  );
}

function DemoPreview() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR 预览卡 */}
      <div className="w-full rounded-2xl bg-gray-50 p-6 flex flex-col items-center">
        <DemoQRPlaceholder />
        <div className="mt-4 text-center">
          <div className="mb-0.5 text-xs text-gray-400">生成的短链接</div>
          <div
            className="font-mono text-sm font-bold"
            style={{ color: "var(--primary)" }}
          >
            dynaQR.io/r/demo
          </div>
        </div>
      </div>

      {/* 下载按钮 */}
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors duration-150 hover:border-[var(--primary-light)] hover:text-[var(--primary)]"
        style={{ borderColor: "var(--nav-border)", color: "var(--muted)" }}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        下载 PNG
      </button>
    </div>
  );
}

export function DemoSection() {
  return (
    <section id="demo" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          badge="在线体验"
          title="实时生成二维码"
          subtitle="输入任意 URL，即时预览动态二维码效果"
        />
        <div
          className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 sm:p-8"
          style={{ borderColor: "var(--nav-border)" }}
        >
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            <DemoForm />
            <DemoPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
