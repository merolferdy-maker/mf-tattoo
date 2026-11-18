import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import { BackgroundWrapper } from "@/components/BackgroundWrapper";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "M&F Tattoo Studio Manager",
  description: "Professional tattoo studio management",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "M&F Tattoo",
  },
  icons: {
    icon: "/icons/icon-192.png",
    shortcut: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="theme-color" content="#080808" />
        <meta name="mobile-web-app-capable" content="yes" />
        {typeof window !== "undefined" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').catch(() => {});
                  });
                }
              `,
            }}
          />
        )}
      </head>
      <BackgroundWrapper>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
        </div>
        <BottomNav />
      </BackgroundWrapper>
    </html>
  );
}
