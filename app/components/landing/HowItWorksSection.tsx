import type { ReactNode } from "react";
import { SectionHeader } from "@/app/components/ui/SectionHeader";

interface Step {
  num: string;
  bg: string;
  icon: ReactNode;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    bg: "var(--primary)",
    icon: (
      <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "创建二维码",
    desc: "输入目标 URL，自定义短码，系统自动生成专属动态二维码与短链接。",
  },
  {
    num: "02",
    bg: "var(--cta)",
    icon: (
      <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: "下载并分发",
    desc: "下载高清 PNG/SVG，印刷在海报、包装、名片等任意载体上。",
  },
  {
    num: "03",
    bg: "#22c55e",
    icon: (
      <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
      </svg>
    ),
    title: "随时更新目标",
    desc: "活动结束后一键换 URL，已印刷的二维码立即跳转新页面，无需重印。",
  },
];

function StepCard({ num, bg, icon, title, desc }: Step) {
  return (
    <div className="relative z-10 text-center">
      <div
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: bg }}
      >
        {icon}
      </div>
      <div
        className="font-heading -mt-1 mb-1 select-none text-5xl font-bold"
        style={{ color: "#f3f4f6" }}
        aria-hidden
      >
        {num}
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

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-y py-20 px-4"
      style={{ background: "#ffffff", borderColor: "#f3f4f6" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          badge="使用流程"
          title="三步搞定"
          subtitle="从注册到二维码上线，最快五分钟。"
        />
        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* 桌面端步骤连线 */}
          <div
            className="absolute top-8 left-1/3 right-1/3 hidden h-px md:block"
            style={{ background: "#e5e7eb" }}
            aria-hidden
          />
          {STEPS.map((step) => (
            <StepCard key={step.num} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
