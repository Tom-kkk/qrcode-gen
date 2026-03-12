import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { QrCode } from "@/types";
import { StatsClient } from "./StatsClient";

export default async function StatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) redirect("/dashboard");

  const qr = data as QrCode;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center gap-2">
          <Link href="/dashboard" className="text-sm hover:underline" style={{ color: "var(--muted)" }}>
            管理台
          </Link>
          <span style={{ color: "var(--muted)" }}>/</span>
          <Link href={`/dashboard/${id}`} className="text-sm hover:underline" style={{ color: "var(--muted)" }}>
            {qr.title ?? qr.short_code}
          </Link>
          <span style={{ color: "var(--muted)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>统计</span>
        </div>

        <StatsClient qrCodeId={id} qrTitle={qr.title ?? qr.short_code} />
      </main>
    </div>
  );
}
