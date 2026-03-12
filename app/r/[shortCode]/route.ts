import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { parseUserAgent } from "@/lib/ua-parser";
import { getGeoFromRequest } from "@/lib/geo";

export const runtime = "nodejs";

function redirectToHome(req: NextRequest) {
  const base = new URL(req.url).origin;
  return NextResponse.redirect(`${base}/`, { status: 302 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
    if (!shortCode?.trim()) return redirectToHome(req);

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("qr_codes")
      .select("id, target_url, is_active")
      .eq("short_code", shortCode.trim())
      .single();

    if (error || !data || !data.is_active) {
      return redirectToHome(req);
    }

    // 异步写入扫描日志，不阻塞重定向；任何异常只打日志，不影响响应
    const uaString = req.headers.get("user-agent") ?? "";
    const ua = parseUserAgent(uaString);
    const geo = getGeoFromRequest(req);
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;

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
      .catch((err) => console.error("[r/[shortCode]] scan_log:", err));

    return NextResponse.redirect(data.target_url, {
      status: 302,
      headers: { "Cache-Control": "no-store, no-cache" },
    });
  } catch (err) {
    console.error("[r/[shortCode]]", err);
    return redirectToHome(req);
  }
}
