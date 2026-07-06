import {
  getButtonClassName,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      className={getButtonClassName({ variant, size, className })}
      href={href}
    >
      {children}
    </Link>
  );
}
