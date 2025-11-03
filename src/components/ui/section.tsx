import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement>;

export function Section({ className, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "relative py-16 sm:py-20 lg:py-24",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-1/2 before:-z-10 before:h-[120%] before:-translate-y-1/2 before:rounded-[3rem] before:bg-surface/60 before:opacity-0 before:blur-3xl before:transition-opacity before:content-['']",
        "hover:before:opacity-100",
        className,
      )}
      {...props}
    />
  );
}
