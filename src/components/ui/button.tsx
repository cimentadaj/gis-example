import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type ButtonElementProps = React.ButtonHTMLAttributes<HTMLButtonElement> & CommonProps;
type AnchorElementProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonProps & {
    href: string;
  };

const baseStyles =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-white shadow-[0_20px_45px_-20px_rgba(14,165,233,0.7)] hover:bg-primary-400 hover:shadow-[0_30px_60px_-25px_rgba(56,189,248,0.8)]",
  secondary:
    "bg-white/10 text-foreground ring-1 ring-white/15 hover:bg-white/20 hover:ring-white/25",
  ghost: "text-foreground/70 hover:text-foreground hover:bg-white/5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonElementProps>(
  ({ className, variant = "primary", type = "button", children, ...props }, ref) => {
    return (
      <button ref={ref} type={type} className={cn(baseStyles, variants[variant], className)} {...props}>
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-500/0 via-primary-400/20 to-primary-500/0 blur-xl" />
      </button>
    );
  },
);

Button.displayName = "Button";

export const AnchorButton = forwardRef<HTMLAnchorElement, AnchorElementProps>(
  ({ className, variant = "primary", href, children, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-500/0 via-primary-400/20 to-primary-500/0 blur-xl" />
      </Link>
    );
  },
);

AnchorButton.displayName = "AnchorButton";
