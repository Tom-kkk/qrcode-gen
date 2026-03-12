"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DashboardHeader() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between border-b px-6 py-3"
      style={{
        background: "var(--nav-bg)",
        backdropFilter: "blur(8px)",
        borderColor: "var(--nav-border)",
      }}
    >
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center"
          style={{ background: "var(--primary)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.2" />
            <rect x="14" y="3" width="7" height="7" rx="1.2" />
            <rect x="3" y="14" width="7" height="7" rx="1.2" />
            <path d="M14 14h3v3M17 17h3v3M14 20h3" />
          </svg>
        </div>
        <span className="font-heading text-base font-bold" style={{ color: "var(--primary-dark)" }}>
          DynaQR
        </span>
        <span
          className="hidden rounded-md px-2 py-0.5 text-xs font-medium sm:inline-block"
          style={{ background: "rgba(124,58,237,0.1)", color: "var(--primary)" }}
        >
          管理后台
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/create"
          className="rounded-xl px-3 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--primary)" }}
        >
          + 新建
        </Link>
        <button
          onClick={handleSignOut}
          className="rounded-xl px-3 py-1.5 text-sm font-medium transition-colors hover:bg-purple-50"
          style={{ color: "var(--muted-strong)" }}
        >
          退出
        </button>
      </div>
    </header>
  );
}
