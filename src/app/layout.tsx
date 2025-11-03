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
  title: "AetherCity Intelligence | AI-Driven Smart City GIS Command Center",
  description:
    "Experience an immersive smart-city GIS platform that fuses AI, ML, and digital twins to orchestrate mobility, energy, climate resilience, and public safety in real time.",
  keywords: [
    "Smart City",
    "GIS",
    "Digital Twin",
    "Urban Analytics",
    "Artificial Intelligence",
    "Mobility Optimization",
    "Energy Management",
  ],
  openGraph: {
    title: "AetherCity Intelligence | AI-Driven Smart City GIS Command Center",
    description:
      "A flagship GIS experience demonstrating AI-powered insights, predictive analytics, and city-scale digital twin storytelling.",
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
