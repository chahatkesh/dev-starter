import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "md" | "lg" | "xl" | "content";
  centered?: boolean;
  theme?: "light" | "dark";
};

const maxWidthClasses = {
  md: "max-w-md",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  content: "max-w-content",
} as const;

export function PageShell({
  children,
  footer,
  maxWidth = "lg",
  centered = false,
  theme = "light",
}: PageShellProps) {
  return (
    <main
      className={cn(
        "min-h-screen px-6 py-8",
        theme === "dark"
          ? "surface-dark bg-canvas text-on-primary"
          : "surface-light bg-background text-foreground",
        centered && "flex items-center justify-center py-12",
      )}
    >
      <section
        className={cn(
          "mx-auto flex w-full flex-col gap-8",
          maxWidthClasses[maxWidth],
          centered && "justify-center",
        )}
      >
        {children}
        {footer}
      </section>
    </main>
  );
}
