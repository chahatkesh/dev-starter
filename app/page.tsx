import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/helpers";

export default async function Home() {
  await requireAuth();

  // Redirect to dashboard
  redirect("/dashboard");
}
