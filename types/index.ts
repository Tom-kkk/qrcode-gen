// 全局共享 TypeScript 类型定义

export interface Profile {
  id: string;
  username: string;
  plan: "free" | "pro" | "enterprise";
  created_at: string;
}

export interface QrCode {
  id: string;
  short_code: string;
  target_url: string;
  title: string | null;
  created_by: string;
  is_active: boolean;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

export interface ScanLog {
  id: string;
  qr_code_id: string;
  scanned_at: string;
  ip_address: string | null;
  user_agent: string | null;
  device_type: "mobile" | "desktop" | "tablet" | null;
  os: string | null;
  browser: string | null;
  country: string | null;
  city: string | null;
  referrer: string | null;
}

export interface UrlHistory {
  id: string;
  qr_code_id: string;
  old_url: string;
  new_url: string;
  changed_by: string;
  changed_at: string;
}

// API 响应类型
export interface StatsOverview {
  total_scans: number;
  today_scans: number;
  unique_ips: number;
  last_scanned_at: string | null;
}

export interface TimelinePoint {
  date: string;
  scans: number;
}

export interface DeviceBreakdown {
  device_type: string;
  count: number;
  percentage: number;
}
