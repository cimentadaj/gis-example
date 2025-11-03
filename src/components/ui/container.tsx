import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-6 md:px-10 xl:max-w-7xl", className)}
      {...props}
    />
  );
}
