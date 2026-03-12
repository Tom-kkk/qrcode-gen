// SWR Hook：获取单个二维码的统计数据
// 依赖 GET /api/stats/[id]
import type { StatsOverview, TimelinePoint, DeviceBreakdown } from "@/types";

export function useStats(_qrCodeId: string): {
  overview: StatsOverview | undefined;
  timeline: TimelinePoint[];
  devices: DeviceBreakdown[];
  isLoading: boolean;
  error: Error | undefined;
} {
  // TODO: 实现 SWR 数据获取
  return { overview: undefined, timeline: [], devices: [], isLoading: false, error: undefined };
}
