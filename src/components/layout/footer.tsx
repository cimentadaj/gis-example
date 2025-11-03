import { Github, Linkedin, Globe2 } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";

const links = [
  { label: "Privacy", href: "#privacy" },
  { label: "Security", href: "#security" },
  { label: "Documentation", href: "#docs" },
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com", Icon: Linkedin },
  { label: "GitHub", href: "https://www.github.com", Icon: Github },
  { label: "Website", href: "https://www.example.com", Icon: Globe2 },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-transparent via-white/5 to-white/10">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-300">Nexus Consulting</p>
          <p className="mt-3 max-w-md text-sm text-foreground/70">
            Designing human-centric, AI-powered infrastructure for the resilient cities of tomorrow.
          </p>
        </div>

        <div className="flex flex-col gap-6 text-sm sm:flex-row sm:items-center">
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <Link key={link.label} href={link.href} className="text-foreground/60 hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:border-primary-400/40 hover:bg-primary-400/10"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </Container>
      <div className="border-t border-white/5">
        <Container className="flex flex-col gap-2 py-6 text-xs text-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Nexus Consulting. All rights reserved.</span>
          <span>Designed for visionary smart-city leaders and urban innovation labs.</span>
        </Container>
      </div>
    </footer>
  );
}
