import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

type LayoutShellProps = {
  children: React.ReactNode;
};

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <BackgroundDecor />
      <Header />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-48 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-[50%] bg-primary-500/30 blur-[140px]" />
      <div className="absolute bottom-0 left-0 h-[22rem] w-[22rem] -translate-x-1/2 translate-y-1/2 rounded-[45%] bg-accent-500/25 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] translate-x-1/3 translate-y-1/3 rounded-[45%] bg-sky-500/20 blur-[160px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.035]" />
    </div>
  );
}
