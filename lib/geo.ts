import { type NextRequest } from "next/server";

export interface GeoInfo {
  country: string | null;
  city: string | null;
}

/**
 * 从请求头中提取地理位置信息。
 * Vercel 自动注入 x-vercel-ip-country / x-vercel-ip-city；
 * Cloudflare 使用 cf-ipcountry；本地开发返回 null。
 */
export function getGeoFromRequest(req: NextRequest): GeoInfo {
  const country =
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    null;
  const city = req.headers.get("x-vercel-ip-city") ?? null;
  return { country, city };
}
