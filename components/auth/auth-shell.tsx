import { CreatorAttribution } from "@/components/marketing/creator-attribution";
import { Alert } from "@/components/ui/alert";
import { BrandMark } from "@/components/ui/brand-mark";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/input";
import { PageShell } from "@/components/ui/page-shell";
import { TextLink } from "@/components/ui/text-link";
import { AppStrings } from "@shared/app-strings";
import type { InputHTMLAttributes, ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <PageShell
      centered
      footer={
        <CreatorAttribution compact className="text-center" theme="dark" />
      }
      maxWidth="md"
      theme="dark"
    >
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <BrandMark label={AppStrings.brand.name} />
          </div>
          <p className="font-mono text-[13px] text-mute">{description}</p>
          <h1 className="text-3xl font-normal tracking-[-0.02em]">{title}</h1>
        </div>

        <Card variant="dark">
          <CardContent className="p-6">{children}</CardContent>
        </Card>

        <p className="text-center text-sm text-ash">{footer}</p>
      </div>
    </PageShell>
  );
}

type AuthFieldProps = {
  id: string;
  label: string;
  type?: string;
  name: string;
  autoComplete?: string;
  required?: boolean;
};

export function AuthField({
  id,
  label,
  type = "text",
  name,
  autoComplete,
  required = true,
}: AuthFieldProps) {
  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    name,
    type,
    autoComplete,
    required,
  };

  return <Field id={id} inputProps={inputProps} label={label} tone="dark" />;
}

export { Alert as AuthError };

export function AuthLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <TextLink className="text-on-primary hover:text-brand" href={href}>
      {children}
    </TextLink>
  );
}
