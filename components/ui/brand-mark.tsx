import { cn } from "@/lib/cn";

type BrandMarkProps = {
  className?: string;
  label: string;
};

export function BrandMark({ className, label }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span aria-hidden className="size-3 shrink-0 rounded-full bg-brand" />
      <span className="font-sans text-sm font-normal tracking-tight text-inherit">
        {label}
      </span>
    </div>
  );
}
