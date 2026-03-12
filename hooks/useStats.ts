import { useState } from "react";
import useSWR from "swr";
import type { StatsOverview, TimelinePoint, DeviceBreakdown } from "@/types";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("请求失败");
    return r.json();
  });

export interface UseStatsReturn {
  overview: StatsOverview | undefined;
  timeline: TimelinePoint[];
  devices: DeviceBreakdown[];
  isLoading: boolean;
  error: Error | undefined;
  period: "7d" | "30d" | "90d";
  setPeriod: (p: "7d" | "30d" | "90d") => void;
}

export function useStats(qrCodeId: string): UseStatsReturn {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");

  const { data: overviewData, error: overviewError, isLoading: overviewLoading } =
    useSWR<{ data: StatsOverview }>(
      qrCodeId ? `/api/stats/${qrCodeId}` : null,
      fetcher
    );

  const { data: timelineData, isLoading: timelineLoading } =
    useSWR<{ data: TimelinePoint[] }>(
      qrCodeId ? `/api/stats/${qrCodeId}/timeline?period=${period}` : null,
      fetcher
    );

  const { data: devicesData, isLoading: devicesLoading } =
    useSWR<{ data: DeviceBreakdown[] }>(
      qrCodeId ? `/api/stats/${qrCodeId}/devices` : null,
      fetcher
    );

  return {
    overview: overviewData?.data,
    timeline: timelineData?.data ?? [],
    devices: devicesData?.data ?? [],
    isLoading: overviewLoading || timelineLoading || devicesLoading,
    error: overviewError,
    period,
    setPeriod,
  };
}
