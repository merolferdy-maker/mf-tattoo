"use client";
import { SessionProvider } from "next-auth/react";
import TopBar from "@/components/TopBar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TopBar />
      {children}
    </SessionProvider>
  );
}
