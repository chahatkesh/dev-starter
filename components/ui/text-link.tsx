import { cn } from "@/lib/cn";
import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type TextLinkBaseProps = {
  children: ReactNode;
  className?: string;
};

type InternalTextLinkProps = TextLinkBaseProps & {
  href: string;
  external?: false;
};

type ExternalTextLinkProps = TextLinkBaseProps & {
  href: string;
  external: true;
} & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "rel" | "target">;

export type TextLinkProps = InternalTextLinkProps | ExternalTextLinkProps;

export function TextLink({
  href,
  children,
  className,
  ...props
}: TextLinkProps) {
  const linkClassName = cn(
    "font-medium underline-offset-4 transition-colors hover:underline",
    className,
  );

  if ("external" in props && props.external) {
    return (
      <a
        className={linkClassName}
        href={href}
        rel={props.rel ?? "noopener noreferrer"}
        target={props.target ?? "_blank"}
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={linkClassName} href={href}>
      {children}
    </Link>
  );
}
