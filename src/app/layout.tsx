import type { Metadata } from "next";
import "./globals.css";
import { LayoutShell } from "@/components/layout/layout-shell";

export const metadata: Metadata = {
  title: "Nexus Consulting | GIS City Analysis Command",
  description:
    "Explore Nexus Consulting’s AI-driven smart city dashboard: GIS City Analysis, automated VLR workflows, and mission-ready analytics presented in a single command environment.",
  keywords: [
    "Nexus Consulting",
    "Smart City",
    "GIS City Analysis",
    "GIS Dashboard",
    "AI Analytics",
    "VLR Automation",
    "Urban Operations",
  ],
  openGraph: {
    title: "Nexus Consulting | GIS City Analysis Command",
    description:
      "A world-class GIS dashboard showcasing how Nexus Consulting fuses AI, data science, and GIS City Analysis to orchestrate modern cities.",
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
