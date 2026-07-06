import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  tone?: "light" | "dark";
};

export function Input({ className, tone = "light", ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-app-xs border px-4 text-base outline-none transition focus-visible:ring-2 focus-visible:ring-brand/30",
        tone === "dark"
          ? "border-hairline-soft bg-canvas text-ash placeholder:text-graphite focus:border-on-primary"
          : "border-hairline bg-canvas-light text-ink placeholder:text-muted focus:border-ink",
        className,
      )}
      {...props}
    />
  );
}

export type FieldProps = {
  id: string;
  label: string;
  inputProps: InputProps;
  tone?: "light" | "dark";
};

export function Field({ id, label, inputProps, tone = "light" }: FieldProps) {
  return (
    <label className="block space-y-2" htmlFor={id}>
      <span
        className={cn("text-sm", tone === "dark" ? "text-ash" : "text-muted")}
      >
        {label}
      </span>
      <Input id={id} tone={tone} {...inputProps} />
    </label>
  );
}
