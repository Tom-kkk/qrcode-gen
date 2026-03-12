import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createQrCodeSchema } from "@/lib/validators";
import { generateShortCode } from "@/lib/short-code";
import { getShortLinkUrl } from "@/lib/app-url";
import QRCode from "qrcode";

/** GET /api/qrcodes — 获取当前用户所有二维码 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/** POST /api/qrcodes — 创建新二维码 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = createQrCodeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "参数无效", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { targetUrl, title, shortCode: customShortCode } = parsed.data;
  const shortCode = customShortCode ?? generateShortCode();

  // 检查 profile 是否存在（首次登录自动创建）
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const username = user.user_metadata?.username ?? user.email?.split("@")[0] ?? "user";
    await supabase.from("profiles").insert({ id: user.id, username });
  }

  // 检查短码唯一性
  const { data: existing } = await supabase
    .from("qr_codes")
    .select("id")
    .eq("short_code", shortCode)
    .single();

  if (existing) {
    return NextResponse.json({ error: "该短码已被使用，请换一个" }, { status: 409 });
  }

  const shortUrl = getShortLinkUrl(shortCode);

  // 生成二维码 SVG
  const qrCodeSvg = await QRCode.toString(shortUrl, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
  });

  const { data: qrCode, error } = await supabase
    .from("qr_codes")
    .insert({
      short_code: shortCode,
      target_url: targetUrl,
      title: title ?? null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      id: qrCode.id,
      shortCode,
      shortUrl,
      targetUrl,
      qrCodeSvg,
      createdAt: qrCode.created_at,
    },
    { status: 201 }
  );
}
