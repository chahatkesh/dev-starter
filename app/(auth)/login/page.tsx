"use client";

import { useActionState } from "react";
import { AppStrings } from "@shared/app-strings";
import {
  AuthError,
  AuthField,
  AuthLink,
  AuthShell,
} from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/app/(auth)/login/actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  return (
    <AuthShell
      title={AppStrings.auth.signInTitle}
      description={AppStrings.auth.signInDescription}
      footer={
        <>
          {AppStrings.auth.needAccountPrompt}{" "}
          <AuthLink href="/signup">
            {AppStrings.auth.goToRegisterAction}
          </AuthLink>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        <AuthError message={state.error} />
        <AuthField
          id="email"
          label={AppStrings.auth.emailLabel}
          name="email"
          type="email"
          autoComplete="email"
        />
        <AuthField
          id="password"
          label={AppStrings.auth.passwordLabel}
          name="password"
          type="password"
          autoComplete="current-password"
        />
        <Button
          disabled={isPending}
          fullWidth
          type="submit"
          variant="marketing"
        >
          {isPending
            ? AppStrings.auth.signingInAction
            : AppStrings.auth.signInAction}
        </Button>
      </form>
    </AuthShell>
  );
}
