import type { ReactNode } from "react";
import { SectionBadge } from "./SectionBadge";

interface SectionHeaderProps {
  badge: string;
  title: ReactNode;
  subtitle?: string;
}

export function SectionHeader({ badge, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="text-center mb-14">
      <SectionBadge>{badge}</SectionBadge>
      <h2
        className="font-heading text-3xl font-bold sm:text-4xl mb-3"
        style={{ color: "var(--primary-dark)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="max-w-xl mx-auto text-sm sm:text-base"
          style={{ color: "var(--muted)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
