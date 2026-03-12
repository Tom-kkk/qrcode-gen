// 落地页底部 CTA 区（"准备好让二维码活起来了吗？"）
export function CtaSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
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
          className="cta-btn cursor-pointer rounded-xl px-10 py-4 text-base font-semibold text-white transition-colors duration-150"
        >
          立即免费注册
        </button>
      </div>
    </section>
  );
}
