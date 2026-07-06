import { CreatorAttribution } from "@/components/marketing/creator-attribution";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/ui/brand-mark";
import { ButtonLink } from "@/components/ui/button-link";
import { TextLink } from "@/components/ui/text-link";
import { AppStrings } from "@shared/app-strings";

const redirectRows = [
  [AppStrings.home.redirects.usersLabel, AppStrings.home.redirects.usersValue],
  [
    AppStrings.home.redirects.adminsLabel,
    AppStrings.home.redirects.adminsValue,
  ],
  [
    AppStrings.home.redirects.standardUsersLabel,
    AppStrings.home.redirects.standardUsersValue,
  ],
] as const;

export function HomePage() {
  return (
    <main className="surface-dark h-dvh w-full overflow-hidden bg-canvas text-on-primary">
      <div className="mx-auto grid h-full min-h-0 w-full max-w-content grid-rows-[auto_minmax(0,1fr)_auto] gap-4 px-6 py-5 sm:px-8 sm:py-6">
        <header className="flex items-center justify-between gap-4">
          <BrandMark label={AppStrings.brand.name} />
          <nav className="flex items-center gap-4 text-sm">
            <TextLink className="text-ash hover:text-on-primary" href="/login">
              {AppStrings.home.signInAction}
            </TextLink>
            <ButtonLink href="/signup" variant="marketing">
              {AppStrings.home.createAccountAction}
            </ButtonLink>
          </nav>
        </header>

        <section className="grid min-h-0 items-center gap-6 overflow-y-auto lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="space-y-6">
            <p className="font-mono text-[13px] text-mute">
              {AppStrings.home.eyebrow}
            </p>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-[clamp(2.25rem,6vw,4rem)] font-normal leading-[1] tracking-[-0.04em]">
                {AppStrings.home.headline}
              </h1>
              <p className="max-w-xl text-base leading-[1.5] text-ash sm:text-lg">
                {AppStrings.home.subheadline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/signup" variant="brand">
                {AppStrings.home.createAccountAction}
              </ButtonLink>
              <ButtonLink href="/login" variant="ghost-dark">
                {AppStrings.home.signInAction}
              </ButtonLink>
            </div>
          </div>

          <div className="space-y-5 rounded-marketing border border-hairline-soft bg-canvas-soft p-5 sm:p-6">
            <ul className="flex flex-wrap gap-2">
              {AppStrings.home.highlights.map((item) => (
                <li key={item}>
                  <Badge variant="dark">{item}</Badge>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase text-mute">
                {AppStrings.home.routesTitle}
              </p>
              <div className="divide-y divide-hairline-soft">
                {redirectRows.map(([label, value]) => (
                  <div
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    key={label}
                  >
                    <span className="text-sm text-ash">{label}</span>
                    <span className="font-mono text-sm text-on-primary">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {AppStrings.home.stackItems.map((item) => (
                <Badge key={item} variant="dark">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <CreatorAttribution
          className="border-t border-hairline-soft pt-4 pb-1 text-mute"
          theme="dark"
        />
      </div>
    </main>
  );
}
