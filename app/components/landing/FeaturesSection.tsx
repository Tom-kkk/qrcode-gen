import type { ReactNode } from "react";
import { SectionHeader } from "@/app/components/ui/SectionHeader";

interface Feature {
  icon: ReactNode;
  iconBg: string;
  hoverBorder: string;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: (
      <svg
        className="h-5 w-5"
        style={{ color: "var(--primary)" }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    iconBg: "bg-purple-100",
    hoverBorder: "hover:border-purple-300/60",
    title: "动态修改 URL",
    desc: "二维码图形永远不变，随时在后台更换目标网址，无需重新设计或印刷任何物料。",
  },
  {
    icon: (
      <svg
        className="h-5 w-5 text-[#F97316]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    iconBg: "bg-orange-100",
    hoverBorder: "hover:border-orange-300/60",
    title: "实时扫描追踪",
    desc: "每次扫码自动记录时间、IP、设备类型与地理位置，掌握线下流量真实数据。",
  },
  {
    icon: (
      <svg
        className="h-5 w-5 text-green-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    iconBg: "bg-green-100",
    hoverBorder: "hover:border-green-400/60",
    title: "可视化数据分析",
    desc: "扫码趋势折线图、设备分布饼图、地区热力图，一眼洞察活动效果与转化率。",
  },
];

function FeatureCard({ icon, iconBg, hoverBorder, title, desc }: Feature) {
  return (
    <div
      className={`cursor-default rounded-2xl border bg-white p-6 transition-colors duration-200 ${hoverBorder}`}
      style={{ borderColor: "var(--nav-border)" }}
    >
      <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <h3
        className="font-heading mb-2 text-base font-semibold"
        style={{ color: "var(--primary-dark)" }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {desc}
      </p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          badge="核心功能"
          title="专为线下营销打造"
          subtitle="无论是海报、传单还是包装，二维码一旦印出永远有效，背后目标随时可变。"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
