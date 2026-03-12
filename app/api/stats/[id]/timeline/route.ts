import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

/** GET /api/stats/[id]/timeline — 时间线扫描数据 */
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const period = (searchParams.get("period") ?? "7d") as "7d" | "30d" | "90d";
  const granularity = (searchParams.get("granularity") ?? "day") as "day" | "hour";

  const periodDays = period === "90d" ? 90 : period === "30d" ? 30 : 7;

  // 调用数据库函数
  const { data, error } = await supabase.rpc("get_scan_timeline", {
    p_qr_code_id: id,
    p_days: periodDays,
    p_granularity: granularity,
  });

  if (error) {
    // 回退到直接查询
    const since = new Date();
    since.setDate(since.getDate() - periodDays);

    const { data: logs } = await supabase
      .from("scan_logs")
      .select("scanned_at")
      .eq("qr_code_id", id)
      .gte("scanned_at", since.toISOString())
      .order("scanned_at");

    // 按天聚合
    const byDay: Record<string, number> = {};
    (logs ?? []).forEach(({ scanned_at }) => {
      const key = scanned_at.slice(0, 10);
      byDay[key] = (byDay[key] ?? 0) + 1;
    });

    const timeline = Object.entries(byDay)
      .map(([date, scans]) => ({ date, scans }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      data: timeline,
      total: timeline.reduce((s, r) => s + r.scans, 0),
      period,
    });
  }

  return NextResponse.json({
    data,
    total: (data as { scans: number }[]).reduce((s, r) => s + r.scans, 0),
    period,
  });
}
