"use server";

import { redirect } from "next/navigation";
import { AppError, AppErrors } from "@shared/app-errors";
import { AppStrings } from "@shared/app-strings";
import { getPostLoginPath } from "@/lib/auth/constants";
import type { AuthFormState } from "@/lib/auth/form-state";
import { setSessionCookie } from "@/lib/auth/session";
import { signUpUser } from "@/services/auth-service";

export async function signupAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password !== confirmPassword) {
    return { error: AppErrors.passwordsDoNotMatch.message };
  }

  let session;

  try {
    session = await signUpUser({ email, password });
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message };
    }

    return { error: AppStrings.auth.genericError };
  }

  await setSessionCookie(session);
  redirect(getPostLoginPath(session.role));
}
