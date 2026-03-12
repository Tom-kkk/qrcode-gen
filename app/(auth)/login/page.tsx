"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === "Invalid login credentials"
          ? "邮箱或密码不正确"
          : error.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--primary)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.2" />
                <rect x="14" y="3" width="7" height="7" rx="1.2" />
                <rect x="3" y="14" width="7" height="7" rx="1.2" />
                <path d="M14 14h3v3M17 17h3v3M14 20h3" />
              </svg>
            </div>
            <span className="font-heading text-xl font-bold" style={{ color: "var(--primary-dark)" }}>
              DynaQR
            </span>
          </Link>
          <h1 className="mt-6 font-heading text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            欢迎回来
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            登录您的账号，管理动态二维码
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit}
          className="rounded-2xl border p-8 shadow-sm"
          style={{ background: "#fff", borderColor: "var(--nav-border)" }}>
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--foreground)" }}>
              邮箱
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="demo-input w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all"
              style={{ borderColor: "var(--nav-border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--foreground)" }}>
              密码
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="demo-input w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all"
              style={{ borderColor: "var(--nav-border)", color: "var(--foreground)" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ background: "var(--primary)" }}
          >
            {loading ? "登录中…" : "登录"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm" style={{ color: "var(--muted)" }}>
          还没有账号？{" "}
          <Link href="/register" className="font-medium hover:underline" style={{ color: "var(--primary)" }}>
            免费注册
          </Link>
        </p>
      </div>
    </div>
  );
}
