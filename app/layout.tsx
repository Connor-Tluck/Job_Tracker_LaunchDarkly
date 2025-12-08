import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { LaunchDarklyProvider } from "@/components/LaunchDarklyProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Search OS",
  description: "Your complete job search management platform. Track applications, prepare for interviews, and land your dream job.",
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

