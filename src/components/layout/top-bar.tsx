import Link from "next/link";
import { Sparkles, Plus } from "lucide-react";

type TopBarProps = {
  title?: string;
  showCreateVlr?: boolean;
};

export function TopBar({ title = "Nexus Consulting", showCreateVlr = true }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 shadow-sm">
            <Sparkles className="h-6 w-6" />
          </span>
          <span className="text-xl font-semibold tracking-tight text-slate-700 sm:text-[1.6rem]">{title}</span>
        </Link>

        {showCreateVlr && (
          <Link
            href="/create-vlr"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-600 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create VLR</span>
          </Link>
        )}
      </div>
    </header>
  );
}
