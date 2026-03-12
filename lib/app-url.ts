/**
 * 应用根 URL（无末尾斜杠），用于生成短链等。
 * 生产环境请在 Vercel 中设置 NEXT_PUBLIC_APP_URL=https://qrcode.zhxnodehub.top
 */
export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

/** 生成短链跳转 URL，保证不会出现 //r/ 双斜杠 */
export function getShortLinkUrl(shortCode: string): string {
  return `${getAppUrl()}/r/${shortCode}`;
}
