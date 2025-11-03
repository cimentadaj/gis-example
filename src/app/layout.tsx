import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/layout/layout-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus Consulting | Smart City Digital Twin Command",
  description:
    "Explore Nexus Consulting’s AI-driven smart city dashboard: spatial digital twins, automated VLR workflows, and mission-ready analytics presented in a single command environment.",
  keywords: [
    "Nexus Consulting",
    "Smart City",
    "Digital Twin",
    "GIS Dashboard",
    "AI Analytics",
    "VLR Automation",
    "Urban Operations",
  ],
  openGraph: {
    title: "Nexus Consulting | Smart City Digital Twin Command",
    description:
      "A world-class GIS dashboard showcasing how Nexus Consulting fuses AI, data science, and digital twins to orchestrate modern cities.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
