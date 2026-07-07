import { CreatorAttribution } from "@/components/marketing/creator-attribution";
import { LogoutButton } from "@/components/auth/logout-button";
import { BrandMark } from "@/components/ui/brand-mark";
import { Card, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { AppStrings } from "@shared/app-strings";
import { getCurrentSession } from "@/lib/auth/session";

export default async function AdminPage() {
  const session = await getCurrentSession();

  return (
    <PageShell
      footer={<CreatorAttribution compact theme="dark" />}
      maxWidth="content"
      theme="dark"
    >
      <div className="flex items-center justify-between border-b border-hairline-soft pb-6">
        <div className="space-y-3">
          <BrandMark label={AppStrings.brand.name} />
          <div>
            <p className="font-mono text-[13px] text-mute">
              {AppStrings.adminDashboard.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-normal tracking-[-0.02em]">
              {AppStrings.adminDashboard.title}
            </h1>
          </div>
        </div>
        <LogoutButton />
      </div>

      <Card variant="dark">
        <CardContent className="p-6">
          <p className="text-sm text-ash">
            {AppStrings.auth.signedInAsPrefix}{" "}
            <span className="text-on-primary">{session?.email}</span>
          </p>
          <p className="mt-3 text-sm leading-6 text-ash">
            {AppStrings.adminDashboard.descriptionPrefix}{" "}
            <code className="font-mono text-on-primary">
              {AppStrings.adminDashboard.adminEmailEnvKey}
            </code>{" "}
            {AppStrings.adminDashboard.descriptionConnector}{" "}
            <code className="font-mono text-on-primary">
              {AppStrings.adminDashboard.adminPasswordEnvKey}
            </code>
            . {AppStrings.adminDashboard.descriptionSuffix}{" "}
            <code className="font-mono text-on-primary">
              {AppStrings.adminDashboard.standardUserPath}
            </code>
            .
          </p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
