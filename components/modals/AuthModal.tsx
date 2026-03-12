"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  open: boolean;
  defaultTab: "login" | "register";
  onClose: () => void;
  showToast: (message: string) => void;
}

function DynaQRLogo() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: "var(--primary)" }}
      >
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
      <span className="font-heading text-xl font-bold" style={{ color: "var(--primary-dark)" }}>
        DynaQR
      </span>
    </div>
  );
}

function InputField({
  id,
  name,
  label,
  type,
  placeholder,
  required,
  minLength,
}: {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="auth-input w-full rounded-xl border px-4 py-3 text-sm transition-all duration-150 focus:outline-none"
        style={{ borderColor: "var(--nav-border)" }}
      />
    </div>
  );
}

export function AuthModal({ open, defaultTab, onClose, showToast }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setTab(defaultTab);
    setError("");
  }, [open, defaultTab]);

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

  if (!open) return null;

  const switchTab = (t: "login" | "register") => {
    setTab(t);
    setError("");
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).trim();
    const password = fd.get("password") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (authError) {
      setError("邮箱或密码错误，请重试");
      return;
    }
    onClose();
    showToast("登录成功，欢迎回来！");
    router.push("/dashboard");
    router.refresh();
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const username = (fd.get("username") as string).trim();
    const email = (fd.get("email") as string).trim();
    const password = fd.get("password") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    onClose();
    showToast("注册成功！请查收验证邮件后登录。");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="fade-in-up relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100"
          aria-label="关闭"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <DynaQRLogo />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`flex-1 cursor-pointer rounded-lg py-2 text-sm transition-all duration-150 ${
              tab === "login"
                ? "bg-white font-semibold shadow-sm"
                : "font-medium text-gray-500 hover:text-gray-700"
            }`}
            style={tab === "login" ? { color: "var(--primary-dark)" } : undefined}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => switchTab("register")}
            className={`flex-1 cursor-pointer rounded-lg py-2 text-sm transition-all duration-150 ${
              tab === "register"
                ? "bg-white font-semibold shadow-sm"
                : "font-medium text-gray-500 hover:text-gray-700"
            }`}
            style={tab === "register" ? { color: "var(--primary-dark)" } : undefined}
          >
            注册
          </button>
        </div>

        {/* Login form */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <InputField id="l-email" name="email" label="邮箱" type="email" placeholder="your@email.com" required />
            <InputField id="l-pass" name="password" label="密码" type="password" placeholder="••••••••" required minLength={6} />
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
              {loading ? "登录中…" : "登录"}
            </button>
          </form>
        )}

        {/* Register form */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <InputField id="r-name" name="username" label="用户名" type="text" placeholder="yourname" required />
            <InputField id="r-email" name="email" label="邮箱" type="email" placeholder="your@email.com" required />
            <InputField id="r-pass" name="password" label="密码" type="password" placeholder="至少 6 位" required minLength={6} />
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="cta-btn w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-white transition-colors duration-150 disabled:opacity-70"
            >
              {loading ? "注册中…" : "免费注册"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
