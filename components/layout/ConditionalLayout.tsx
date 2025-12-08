"use client";

import { usePathname } from "next/navigation";
import { MainLayout } from "./MainLayout";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname?.startsWith("/landing");

  if (isLandingPage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}

