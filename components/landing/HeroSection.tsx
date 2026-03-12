"use client";

import Link from "next/link";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { HeroQRCard } from "./HeroQRCard";
import { useApp } from "@/app/providers";

const BULLET_POINTS = [
  "二维码图形永远不变，目标 URL 随时修改",
  "实时追踪扫码来源、设备类型与地理位置",
  "扫码趋势、设备分布、地区热力图一目了然",
] as const;

function CheckIcon() {
  return (
    <svg className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function HeroCopy() {
  const { openAuthModal, user } = useApp();

  return (
    <div className="fade-in-up">
      <SectionBadge>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--primary)" }}
          aria-hidden
        />
        全栈动态二维码平台
      </SectionBadge>

      <h1
        className="font-heading text-4xl font-bold leading-[1.12] mb-6 sm:text-5xl lg:text-[3.4rem]"
        style={{ color: "var(--primary-dark)" }}
      >
        让每个<br />
        <span style={{ color: "var(--primary)" }}>二维码</span>都能<br />
        <span className="relative inline-block">
          随时更新
          <span
            className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
            style={{ background: "var(--cta)" }}
            aria-hidden
          />
        </span>
      </h1>

      <p
        className="mb-8 max-w-lg text-base leading-relaxed sm:text-lg"
        style={{ color: "var(--muted)" }}
      >
        印刷之后无需重印，后台一键修改跳转目标。同时自动记录每次扫码的时间、设备与地理位置，让线下流量可追踪、可分析。
      </p>

      <ul className="mb-10 space-y-3">
        {BULLET_POINTS.map((text) => (
          <li
            key={text}
            className="flex items-center gap-3 text-sm font-medium"
            style={{ color: "var(--muted-strong)" }}
          >
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
              <CheckIcon />
            </span>
            {text}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row">
        {user ? (
          <Link
            href="/dashboard"
            className="cta-btn inline-flex items-center justify-center cursor-pointer rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            进入控制台
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal("register")}
            className="cta-btn cursor-pointer rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            免费开始使用
          </button>
        )}
        <a
          href="#demo"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-8 py-3.5 text-base font-semibold transition-colors duration-150 focus:outline-none hover:bg-purple-50"
          style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
          在线体验
        </a>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2 lg:gap-20">
          <HeroCopy />
          <HeroQRCard />
        </div>
      </div>
    </section>
  );
}
