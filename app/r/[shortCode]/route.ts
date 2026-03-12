import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;
  return NextResponse.redirect(new URL(`/?code=${shortCode}`, _request.url), 302);
}
