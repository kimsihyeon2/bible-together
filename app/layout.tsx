import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "@/theme";
import "@mantine/core/styles.css";
import "@/app/globals.css"; // Keep Tailwind for utility classes if needed
import { Geist, Geist_Mono, Noto_Serif_KR } from "next/font/google";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifKr = Noto_Serif_KR({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
});

export const metadata = {
  title: "Bible Together - 성경함께",
  description: "셀 공동체와 함께 성경을 읽고 기도 요청을 나누세요.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "성경함께"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3B82F6"
};

import { AppMain } from "@/components/AppShell/AppMain";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { NotificationManager } from "@/components/NotificationManager";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="성경함께" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          notoSerifKr.variable,
          "antialiased bg-background text-foreground"
        )}
      >
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Notifications />
          <NotificationManager />
          <ServiceWorkerRegistration />
          <AppMain>{children}</AppMain>
          <InstallPrompt />
        </MantineProvider>
      </body>
    </html>
  );
}

