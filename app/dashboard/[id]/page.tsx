export default function DashboardIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="h-20" aria-hidden />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-heading text-2xl font-bold" style={{ color: "var(--primary-dark)" }}>
          管理台
        </h1>
      </main>
    </div>
  );
}
