import { Sparkles } from "lucide-react";

type TopBarProps = {
  title?: string;
};

export function TopBar({ title = "Nexus Consulting" }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 shadow-sm">
          <Sparkles className="h-6 w-6" />
        </span>
        <span className="text-xl font-semibold tracking-tight text-slate-700 sm:text-[1.6rem]">{title}</span>
      </div>
    </header>
  );
}
