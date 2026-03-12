// SWR Hook：获取当前用户的二维码列表，支持乐观更新
// 依赖 GET /api/qrcodes
import type { QrCode } from "@/types";

export function useQrCodes(): {
  qrCodes: QrCode[];
  isLoading: boolean;
  error: Error | undefined;
  mutate: () => void;
} {
  // TODO: 实现 SWR 数据获取
  return { qrCodes: [], isLoading: false, error: undefined, mutate: () => {} };
}
