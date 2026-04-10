import { LogoutButton } from "@/components/auth/logout-button";
import { requireAuth } from "@/lib/auth/helpers";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Shuriken";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">{APP_NAME}</h1>
            <nav className="hidden md:flex gap-4">
              <a
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </a>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
