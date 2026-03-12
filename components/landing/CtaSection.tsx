"use client";

import Link from "next/link";
import { useApp } from "@/app/providers";

export function CtaSection() {
  const { openAuthModal, user } = useApp();

  return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {user ? (
          <>
            <h2
              className="font-heading mb-4 text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--primary-dark)" }}
            >
              欢迎回来！<br />继续管理您的二维码
            </h2>
            <p className="mb-8 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
              前往控制台查看数据、创建新码或修改跳转链接。
            </p>
            <Link
              href="/dashboard"
              className="cta-btn inline-block cursor-pointer rounded-xl px-10 py-4 text-base font-semibold text-white transition-colors duration-150 focus:outline-none"
            >
              进入控制台
            </Link>
          </>
        ) : (
          <>
            <h2
              className="font-heading mb-4 text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--primary-dark)" }}
            >
              准备好让二维码<br />活起来了吗？
            </h2>
            <p className="mb-8 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
              免费计划包含 5 个动态码，无需信用卡，三十秒完成注册。
            </p>
            <button
              type="button"
              onClick={() => openAuthModal("register")}
              className="cta-btn cursor-pointer rounded-xl px-10 py-4 text-base font-semibold text-white transition-colors duration-150 focus:outline-none"
            >
              立即免费注册
            </button>
          </>
        )}
      </div>
    </section>
  );
}
