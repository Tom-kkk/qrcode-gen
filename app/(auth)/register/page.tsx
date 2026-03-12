"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("密码长度不能少于 8 位");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        if (error.message.includes("already registered")) {
          setError("该邮箱已注册，请直接登录");
        } else {
          setError(error.message);
        }
        return;
      }
      // 如果 Supabase 配置了 email confirm，session 为空则提示验证邮件
      if (!data.session) {
        setSuccess(true);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--background)" }}
      >
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-heading text-xl font-bold" style={{ color: "var(--foreground)" }}>
            注册成功！
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            验证邮件已发送至 <strong>{email}</strong>，请查收邮件并点击验证链接后登录。
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
            style={{ background: "var(--primary)" }}
          >
            前往登录
          </Link>
        </div>
      </div>
    );
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
            创建账号
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            免费开始管理您的动态二维码
          </p>
        </div>

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
              用户名
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="例如：zhangsan"
              className="demo-input w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all"
              style={{ borderColor: "var(--nav-border)", color: "var(--foreground)" }}
            />
          </div>

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
              placeholder="至少 8 位"
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
            {loading ? "注册中…" : "免费注册"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm" style={{ color: "var(--muted)" }}>
          已有账号？{" "}
          <Link href="/login" className="font-medium hover:underline" style={{ color: "var(--primary)" }}>
            立即登录
          </Link>
        </p>
      </div>
    </div>
  );
}
