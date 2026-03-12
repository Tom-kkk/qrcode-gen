import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { QrCode } from "@/types";
import { QrDetailClient } from "./QrDetailClient";

export default async function QrDetailPage({
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const qr = data as QrCode;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center gap-2">
          <Link href="/dashboard" className="text-sm hover:underline" style={{ color: "var(--muted)" }}>
            管理台
          </Link>
          <span style={{ color: "var(--muted)" }}>/</span>
          <span className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
            {qr.title ?? qr.short_code}
          </span>
        </div>

        <QrDetailClient qr={qr} appUrl={appUrl} />
      </main>
    </div>
  );
}
