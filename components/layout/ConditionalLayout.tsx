"use client";

import { usePathname } from "next/navigation";
import { MainLayout } from "./MainLayout";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // We keep marketing pages under `/landing/*` "chrome-free" so they feel like a public site,
  // while everything else uses the main in-app layout (sidebar/header).
  const isLandingPage = pathname?.startsWith("/landing");

  if (isLandingPage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}

