import { UAParser } from "ua-parser-js";

export interface ParsedUA {
  deviceType: "mobile" | "desktop" | "tablet";
  os: string;
  browser: string;
}

export function parseUserAgent(ua: string): ParsedUA {
  const parser = new UAParser(ua);
  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();

  let deviceType: "mobile" | "desktop" | "tablet" = "desktop";
  if (device.type === "mobile") deviceType = "mobile";
  else if (device.type === "tablet") deviceType = "tablet";

  return {
    deviceType,
    os: os.name ?? "Unknown",
    browser: browser.name ?? "Unknown",
  };
}
