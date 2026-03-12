import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

// Dashboard 专属 Layout：隐藏落地页 Navbar，换用 DashboardHeader
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardHeader />
      {children}
    </>
  );
}
