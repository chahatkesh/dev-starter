import { Resend } from "resend";
import { env } from "@/lib/env";

// Lazy initialization to avoid errors during build when RESEND_API_KEY is not set
let _resendClient: Resend | null = null;

export const getResendClient = () => {
  _resendClient ??= new Resend(env.RESEND_API_KEY);
  return _resendClient;
};

export const emailConfig = {
  from: env.RESEND_FROM_EMAIL || "noreply@example.com",
  defaultSubject: "Application Notification",
} as const;
