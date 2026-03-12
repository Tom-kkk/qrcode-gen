import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateQrCodeSchema } from "@/lib/validators";
import { getShortLinkUrl } from "@/lib/app-url";
import QRCode from "qrcode";

type Params = { params: Promise<{ id: string }> };

/** GET /api/qrcodes/[id] — 获取单个二维码详情 */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "二维码不存在" }, { status: 404 });
  }

  const shortUrl = getShortLinkUrl(data.short_code);
  const qrCodeSvg = await QRCode.toString(shortUrl, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
  });

  return NextResponse.json({ data: { ...data, shortUrl, qrCodeSvg } });
}

/** PUT /api/qrcodes/[id] — 修改二维码 */
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = updateQrCodeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "参数无效", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // 查询旧记录（RLS 保证只能访问自己的）
  const { data: old, error: fetchError } = await supabase
    .from("qr_codes")
    .select("target_url")
    .eq("id", id)
    .single();

  if (fetchError || !old) {
    return NextResponse.json({ error: "二维码不存在" }, { status: 404 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (parsed.data.targetUrl !== undefined) updates.target_url = parsed.data.targetUrl;
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.isActive !== undefined) updates.is_active = parsed.data.isActive;

  // 如果目标 URL 变更，写入历史记录
  if (parsed.data.targetUrl && parsed.data.targetUrl !== old.target_url) {
    await supabase.from("url_history").insert({
      qr_code_id: id,
      old_url: old.target_url,
      new_url: parsed.data.targetUrl,
      changed_by: user.id,
    });
  }

  const { data, error } = await supabase
    .from("qr_codes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/** DELETE /api/qrcodes/[id] — 删除二维码 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { error } = await supabase
    .from("qr_codes")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
