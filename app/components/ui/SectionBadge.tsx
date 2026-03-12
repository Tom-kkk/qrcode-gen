import type { ReactNode } from "react";

export function SectionBadge({ children }: { children: ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold mb-4"
      style={{ background: "rgba(124,58,237,.1)", color: "var(--primary)" }}
    >
      {children}
    </div>
  );
}
