import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { LaunchDarklyProvider } from "@/components/LaunchDarklyProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Front End Template",
  description: "A reusable UI/UX template for building modern applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LaunchDarklyProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </LaunchDarklyProvider>
      </body>
    </html>
  );
}

