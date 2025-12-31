import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import PageTransition from "@/components/PageTransition";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mood Tracker",
  description: "Track your daily mood, workouts, and drinks.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mood Tracker",
  },
  icons: {
    apple: [
      {
        url: "/icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
    icon: [
      {
        url: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  },
  other: {
    "apple-touch-icon": "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-zinc-950`}
        suppressHydrationWarning
      >
        <noscript>
          <p>Please enable JavaScript to use this app.</p>
        </noscript>
        <ThemeProvider>
          <LayoutWrapper>
            <PageTransition>{children}</PageTransition>
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
