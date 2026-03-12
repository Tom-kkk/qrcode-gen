import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

/** GET /api/stats/[id] — 获取统计汇总数据 */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  // 验证该二维码属于当前用户（RLS 会过滤，返回空则无权）
  const { data: qrCode } = await supabase
    .from("qr_codes")
    .select("id, scan_count")
    .eq("id", id)
    .single();

  if (!qrCode) {
    return NextResponse.json({ error: "二维码不存在" }, { status: 404 });
  }

  // 使用数据库函数获取统计
  const { data, error } = await supabase.rpc("get_scan_stats", {
    p_qr_code_id: id,
  });

  if (error) {
    // 若函数不存在则回退到简单查询
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [{ count: todayScans }, { count: uniqueIps }, { data: lastScan }] =
      await Promise.all([
        supabase
          .from("scan_logs")
          .select("*", { count: "exact", head: true })
          .eq("qr_code_id", id)
          .gte("scanned_at", today.toISOString()),
        supabase
          .from("scan_logs")
          .select("ip_address", { count: "exact", head: true })
          .eq("qr_code_id", id),
        supabase
          .from("scan_logs")
          .select("scanned_at")
          .eq("qr_code_id", id)
          .order("scanned_at", { ascending: false })
          .limit(1),
      ]);

    return NextResponse.json({
      data: {
        total_scans: qrCode.scan_count,
        today_scans: todayScans ?? 0,
        unique_ips: uniqueIps ?? 0,
        last_scanned_at: lastScan?.[0]?.scanned_at ?? null,
      },
    });
  }

  return NextResponse.json({ data });
}
