"use client";

import { useEffect } from "react";

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  duration?: number;
}

export function Toast({ visible, message, onHide, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onHide, duration);
    return () => clearTimeout(t);
  }, [visible, message, onHide, duration]);

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[200] transition-all duration-300"
      style={{
        transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
        opacity: visible ? 1 : 0,
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg"
        style={{ background: "var(--primary-dark)" }}
      >
        <svg
          className="h-4 w-4 flex-shrink-0 text-green-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        {message}
      </div>
    </div>
  );
}
