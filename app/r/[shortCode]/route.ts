import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { parseUserAgent } from "@/lib/ua-parser";
import { getGeoFromRequest } from "@/lib/geo";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;
  // Service Client 绕过 RLS，重定向路由无用户上下文
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("qr_codes")
    .select("id, target_url, is_active")
    .eq("short_code", shortCode)
    .single();

  if (error || !data || !data.is_active) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  // 异步写入扫描日志，不阻塞重定向
  const uaString = req.headers.get("user-agent") ?? "";
  const ua = parseUserAgent(uaString);
  const geo = getGeoFromRequest(req);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? null;

  // 触发异步日志写入，不阻塞重定向响应
  Promise.resolve()
    .then(() =>
      supabase.from("scan_logs").insert({
        qr_code_id: data.id,
        ip_address: ip,
        user_agent: uaString || null,
        device_type: ua.deviceType,
        os: ua.os,
        browser: ua.browser,
        country: geo.country,
        city: geo.city,
        referrer: req.headers.get("referer") ?? null,
      })
    )
    .then(() =>
      supabase.rpc("increment_scan_count", { p_qr_code_id: data.id })
    )
    .catch(console.error);

  return NextResponse.redirect(data.target_url, {
    status: 302,
    headers: {
      "Cache-Control": "no-store, no-cache",
    },
  });
}
