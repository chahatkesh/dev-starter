import { HomePage } from "@/components/marketing/home-page";
import { redirect } from "next/navigation";
import { getPostLoginPath } from "@/lib/auth/constants";
import { getCurrentSession } from "@/lib/auth/session";

export default async function Home() {
  const session = await getCurrentSession();

  if (session) {
    redirect(getPostLoginPath(session.role));
  }

  return <HomePage />;
}
