"use client";

import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnchorButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Platform", href: "#platform" },
  { label: "AI Insights", href: "#ai-insights" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Why Us", href: "#why-us" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 min-h-[7.5rem] backdrop-blur-lg backdrop-saturate-150">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-500/20 via-transparent to-accent-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <Container className="relative flex min-h-[7rem] items-center justify-between border-b border-white/10 py-12">
        <Link href="/" className="group inline-flex items-center gap-6 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 via-accent-500 to-indigo-500 text-white shadow-[0_0_45px_rgba(59,130,246,0.6)] transition-transform group-hover:scale-105">
            <Sparkles className="h-9 w-9" />
          </span>
          <span className="text-[2.5rem] font-semibold leading-tight tracking-tight md:text-[3.4rem]">
            Nexus<span className="text-primary-400"> Consulting</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-16 text-xl font-semibold md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-foreground/70 transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="#demo" className="text-xl font-semibold text-foreground/70 hover:text-foreground">
            Product Tour
          </Link>
          <AnchorButton href="#contact" variant="primary" className="px-9 py-5 text-lg">
            Request Pilot
          </AnchorButton>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground md:hidden"
        >
          <Menu className="h-7 w-7" />
        </button>
      </Container>

      <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}

function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div
      className={cn(
        "md:hidden",
        "px-6 pb-6 transition-[max-height,opacity] duration-300 ease-in-out",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
      )}
    >
      <nav className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface/80 p-6 text-sm font-medium shadow-lg shadow-indigo-950/30">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} onClick={onClose} className="text-foreground/70 hover:text-foreground">
            {item.label}
          </Link>
        ))}
        <AnchorButton href="#contact" variant="primary" className="justify-center">
          Request Pilot
        </AnchorButton>
      </nav>
    </div>
  );
}
