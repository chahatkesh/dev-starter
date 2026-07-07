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
import { signupAction } from "@/app/(auth)/signup/actions";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, {});

  return (
    <AuthShell
      title={AppStrings.auth.signUpTitle}
      description={AppStrings.auth.signUpDescription}
      footer={
        <>
          {AppStrings.auth.haveAccountPrompt}{" "}
          <AuthLink href="/login">{AppStrings.auth.goToLoginAction}</AuthLink>
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
          autoComplete="new-password"
        />
        <AuthField
          id="confirmPassword"
          label={AppStrings.auth.confirmPasswordLabel}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
        />
        <Button
          disabled={isPending}
          fullWidth
          type="submit"
          variant="marketing"
        >
          {isPending
            ? AppStrings.auth.creatingAccountAction
            : AppStrings.auth.createAccountAction}
        </Button>
      </form>
    </AuthShell>
  );
}
