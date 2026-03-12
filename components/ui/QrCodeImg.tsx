"use client";

import { useState, useEffect, type Ref } from "react";
import QRCode from "qrcode";

interface QrCodeImgProps {
  value: string;
  size?: number;
  className?: string;
  ecLevel?: "L" | "M" | "Q" | "H";
  imgId?: string;
  imgRef?: Ref<HTMLImageElement>;
}

function Placeholder({ size }: { size: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl bg-gray-50"
      style={{ width: size, height: size }}
    >
      <svg
        className="text-gray-200"
        style={{ width: size * 0.4, height: size * 0.4 }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <rect x="3"  y="3"  width="7" height="7" rx="1" />
        <rect x="14" y="3"  width="7" height="7" rx="1" />
        <rect x="3"  y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3M17 17h3v3M14 20h3" />
      </svg>
    </div>
  );
}

export function QrCodeImg({ value, size = 192, className = "", ecLevel = "M", imgId, imgRef }: QrCodeImgProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (!value) { setDataUrl(""); return; }
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: { dark: "#4C1D95", light: "#ffffff" },
      errorCorrectionLevel: ecLevel,
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [value, size, ecLevel]);

  if (!dataUrl) return <Placeholder size={size} />;

  return (
    <img
      ref={imgRef}
      id={imgId}
      src={dataUrl}
      alt="二维码"
      width={size}
      height={size}
      className={`rounded-xl block ${className}`}
    />
  );
}
