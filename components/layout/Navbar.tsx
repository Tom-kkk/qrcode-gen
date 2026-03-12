"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/app/providers";

const DynaQRLogo = () => (
  <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-[var(--primary)] flex items-center justify-center">
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <path d="M14 14h3v3M17 17h3v3M14 20h3" />
    </svg>
  </div>
);

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openAuthModal } = useApp();

  // 在 dashboard 路由下隐藏（DashboardHeader 会替代它）
  if (pathname.startsWith("/dashboard")) return null;

  const avatarLetter = (user?.user_metadata?.username as string)?.[0]?.toUpperCase()
    ?? user?.email?.[0]?.toUpperCase()
    ?? "U";
  const displayName =
    (user?.user_metadata?.username as string) ?? user?.email?.split("@")[0] ?? "用户";

  return (
    <nav
      className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between rounded-2xl border px-5 py-3 transition-all duration-200"
      style={{
        background: "var(--nav-bg)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderColor: "var(--nav-border)",
      }}
      role="navigation"
      aria-label="主导航"
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex cursor-pointer items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-lg"
      >
        <DynaQRLogo />
        <span
          className="font-heading text-lg font-bold"
          style={{ color: "var(--primary-dark)" }}
        >
          DynaQR
        </span>
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
        <Link href="#features" className="cursor-pointer transition-colors duration-150 hover:text-[var(--primary)]">
          功能
        </Link>
        <Link href="#how-it-works" className="cursor-pointer transition-colors duration-150 hover:text-[var(--primary)]">
          流程
        </Link>
        <Link href="#demo" className="cursor-pointer transition-colors duration-150 hover:text-[var(--primary)]">
          体验
        </Link>
      </div>

      {/* Guest buttons */}
      {!user ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="cursor-pointer rounded-xl px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-purple-50 hover:text-[var(--primary)]"
            style={{ color: "var(--primary-dark)" }}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => openAuthModal("register")}
            className="cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:opacity-90"
            style={{ backgroundColor: "var(--primary)" }}
          >
            免费注册
          </button>
        </div>
      ) : (
        /* Logged-in user */
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="hidden cursor-pointer rounded-xl px-3 py-1.5 text-sm font-medium transition-colors duration-150 sm:block hover:bg-purple-50 hover:text-[var(--primary)]"
            style={{ color: "var(--primary-dark)" }}
          >
            管理台
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex cursor-pointer items-center gap-2 focus:outline-none"
          >
            <div
              className="flex h-8 w-8 select-none items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: "var(--primary)" }}
              aria-hidden
            >
              {avatarLetter}
            </div>
            <span className="hidden text-sm font-medium sm:block" style={{ color: "var(--muted-strong)" }}>
              {displayName}
            </span>
          </button>
        </div>
      )}
    </nav>
  );
}
