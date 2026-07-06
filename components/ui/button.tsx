import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const buttonVariants = {
  primary: "rounded-app-md bg-ink text-on-primary hover:opacity-90",
  marketing:
    "rounded-full border border-ink bg-canvas-light text-ink hover:opacity-90",
  brand: "rounded-full bg-brand text-ink hover:opacity-90",
  secondary:
    "rounded-app-md border border-border bg-transparent text-foreground hover:bg-surface",
  "secondary-dark":
    "rounded-app-md border border-hairline-soft bg-canvas-soft text-ash hover:text-on-primary",
  ghost: "rounded-full bg-transparent text-foreground hover:text-ink",
  "ghost-dark": "rounded-full bg-transparent text-ash hover:text-on-primary",
} as const;

const buttonSizes = {
  sm: "h-9 px-4 text-[13px] font-medium",
  md: "h-11 px-6 text-base font-medium",
} as const;

const buttonBaseClassName =
  "inline-flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60";

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
};

export function getButtonClassName({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  return cn(
    buttonBaseClassName,
    buttonVariants[variant],
    buttonSizes[size],
    fullWidth && "w-full",
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClassName({ variant, size, fullWidth, className })}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
