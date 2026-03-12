import useSWR, { type KeyedMutator } from "swr";
import type { QrCode } from "@/types";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("请求失败");
    return r.json();
  });

export interface UseQrCodesReturn {
  qrCodes: QrCode[];
  isLoading: boolean;
  error: Error | undefined;
  mutate: KeyedMutator<{ data: QrCode[] }>;
}

export function useQrCodes(): UseQrCodesReturn {
  const { data, error, isLoading, mutate } = useSWR<{ data: QrCode[] }>(
    "/api/qrcodes",
    fetcher,
    { revalidateOnFocus: true }
  );

  return {
    qrCodes: data?.data ?? [],
    isLoading,
    error,
    mutate,
  };
}
