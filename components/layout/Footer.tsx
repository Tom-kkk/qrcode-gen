export function Footer() {
  return (
    <footer
      className="border-t bg-white py-10 px-4"
      style={{ borderColor: "var(--nav-border)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: "var(--primary)" }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M14 14h3v3M17 17h3v3M14 20h3" />
            </svg>
          </div>
          <span
            className="font-heading text-sm font-bold"
            style={{ color: "var(--primary-dark)" }}
          >
            DynaQR
          </span>
          <span className="hidden text-sm text-gray-400 sm:block">
            — 动态二维码管理平台
          </span>
        </div>
        <p className="text-sm text-gray-400">© 2026 DynaQR. All rights reserved.</p>
      </div>
    </footer>
  );
}
