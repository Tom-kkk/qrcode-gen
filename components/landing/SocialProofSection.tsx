// 社会认可数字区块（对应设计稿的 "50万+ 累计扫描" 等 4 个指标）
const METRICS = [
  { value: "50万+",  label: "累计扫描次数" },
  { value: "1.2万",  label: "活跃动态码" },
  { value: "3,800+", label: "注册用户" },
  { value: "99.9%",  label: "服务可用率" },
] as const;

export function SocialProofSection() {
  return (
    <section className="border-y py-16 px-4" style={{ background: "#ffffff", borderColor: "#f3f4f6" }}>
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8 text-center md:grid-cols-4">
        {METRICS.map(({ value, label }) => (
          <div key={label}>
            <div
              className="font-heading mb-1 text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--primary-dark)" }}
            >
              {value}
            </div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
