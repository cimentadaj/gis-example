import type { Metadata } from "next";
import "./globals.css";
import { LayoutShell } from "@/components/layout/layout-shell";

export const metadata: Metadata = {
  title: "SDG/VLR Dashboard",
  description:
    "AI-driven smart city dashboard: GIS City Analysis, automated VLR workflows, and mission-ready analytics.",
  keywords: [
    "SDG",
    "VLR",
    "Smart City",
    "GIS City Analysis",
    "GIS Dashboard",
    "AI Analytics",
    "VLR Automation",
    "Urban Operations",
  ],
  openGraph: {
    title: "SDG/VLR Dashboard",
    description:
      "A GIS dashboard showcasing AI, data science, and GIS City Analysis for modern cities.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background antialiased">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
