import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: "light" | "dark";
};

export function Card({
  className,
  children,
  variant = "light",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-marketing border",
        variant === "dark"
          ? "border-hairline-soft bg-canvas-soft text-on-primary"
          : "border-border bg-canvas-light text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type CardContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function CardContent({
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div className={cn("p-8", className)} {...props}>
      {children}
    </div>
  );
}
