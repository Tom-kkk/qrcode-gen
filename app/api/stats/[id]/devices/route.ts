import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

/** GET /api/stats/[id]/devices — 设备/OS 分布 */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("get_device_breakdown", {
    p_qr_code_id: id,
  });

  if (error) {
    // 回退到直接查询
    const { data: logs } = await supabase
      .from("scan_logs")
      .select("device_type")
      .eq("qr_code_id", id);

    const counts: Record<string, number> = {};
    (logs ?? []).forEach(({ device_type }) => {
      const key = device_type ?? "unknown";
      counts[key] = (counts[key] ?? 0) + 1;
    });

    const total = Object.values(counts).reduce((s, n) => s + n, 0);
    const devices = Object.entries(counts).map(([device_type, count]) => ({
      device_type,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    }));

    return NextResponse.json({ data: devices });
  }

  return NextResponse.json({ data });
}
