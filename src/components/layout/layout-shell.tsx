import type { ReactNode } from "react";

type LayoutShellProps = {
  children: ReactNode;
};

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundDecor />
      <main className="relative z-10 min-h-screen">{children}</main>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-x-0 top-[-30%] h-[26rem] bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.18),_transparent_65%)]" />
      <div className="absolute inset-x-0 bottom-[-35%] h-[24rem] bg-[radial-gradient(circle_at_center,_rgba(168,192,255,0.1),_transparent_68%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,253,0.6),rgba(255,255,255,0.85))]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
    </div>
  );
}
