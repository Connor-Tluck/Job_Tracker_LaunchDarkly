import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { LaunchDarklyProvider } from "@/components/LaunchDarklyProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Career Stack",
  description: "Your complete job search management platform. Track applications, prepare for interviews, and land your dream job.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {/* LaunchDarklyProvider must wrap any client components that read flags (`useFlags` / `useFeatureFlag`). */}
          <LaunchDarklyProvider>
            {/* Our app has two "modes": marketing pages under `/landing/*` and the main app chrome.
                ConditionalLayout decides which layout to render based on the route. */}
            <ConditionalLayout>{children}</ConditionalLayout>
          </LaunchDarklyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

