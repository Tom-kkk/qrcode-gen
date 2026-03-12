export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* 为固定导航留出顶部间距，与设计稿一致 */}
      <div className="h-20" aria-hidden />
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-12">
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: "var(--primary-dark)" }}>
            DynaQR
          </h1>
          <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--muted)" }}>
            动态二维码管理平台 — 功能、流程、体验
          </p>
          <div id="features" className="h-20" />
          <div id="how-it-works" className="h-20" />
          <div id="demo" className="h-20" />
        </section>
      </main>
    </div>
  );
}
