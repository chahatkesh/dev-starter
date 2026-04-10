import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/helpers";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-muted-foreground mt-2">
          This is your dashboard. Start building your application here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Getting Started</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Check out the documentation to learn more about this starter
            template.
          </p>
          <Button variant="outline" size="sm">
            View Docs
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Database</h3>
          <p className="text-sm text-muted-foreground mb-4">
            PostgreSQL database with Prisma ORM is ready to use.
          </p>
          <Button variant="outline" size="sm">
            Open Studio
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Components</h3>
          <p className="text-sm text-muted-foreground mb-4">
            shadcn/ui components with professional design system.
          </p>
          <Button variant="outline" size="sm">
            Browse Components
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium capitalize">
              {user.status.toLowerCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email Verified:</span>
            <span className="font-medium">
              {user.emailVerified ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
