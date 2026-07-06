import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: "light" | "dark";
};

export function Badge({ children, className, variant = "light" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wide",
        variant === "dark"
          ? "border-hairline-soft bg-canvas text-ash"
          : "border-border bg-canvas-light text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
