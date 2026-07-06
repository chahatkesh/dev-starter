import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export type AlertProps = HTMLAttributes<HTMLParagraphElement> & {
  message?: string | null;
};

export function Alert({ message, className, ...props }: AlertProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        "rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300",
        className,
      )}
      role="alert"
      {...props}
    >
      {message}
    </p>
  );
}
