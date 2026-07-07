"use server";

import { redirect } from "next/navigation";
import { AppError } from "@shared/app-errors";
import { AppStrings } from "@shared/app-strings";
import { getPostLoginPath } from "@/lib/auth/constants";
import type { AuthFormState } from "@/lib/auth/form-state";
import { setSessionCookie } from "@/lib/auth/session";
import { signInUser } from "@/services/auth-service";

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  let session;

  try {
    session = await signInUser({ email, password });
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message };
    }

    return { error: AppStrings.auth.genericError };
  }

  await setSessionCookie(session);
  redirect(getPostLoginPath(session.role));
}
