import { TextLink } from "@/components/ui/text-link";
import { AppStrings } from "@shared/app-strings";
import { CreatorLinks, withStarterAttribution } from "@shared/creator-links";
import { cn } from "@/lib/cn";

type CreatorAttributionProps = {
  className?: string;
  compact?: boolean;
  theme?: "light" | "dark";
};

export function CreatorAttribution({
  className = "",
  compact = false,
  theme = "light",
}: CreatorAttributionProps) {
  const portfolioHref = withStarterAttribution(CreatorLinks.portfolioUrl);
  const githubHref = withStarterAttribution(CreatorLinks.githubUrl);
  const linkClassName =
    theme === "dark" ? "text-ash hover:text-on-primary" : undefined;

  if (compact) {
    return (
      <p
        className={cn(
          "text-sm",
          theme === "dark" ? "text-mute" : "text-muted",
          className,
        )}
      >
        {AppStrings.creator.attributionPrefix}{" "}
        <TextLink className={linkClassName} external href={portfolioHref}>
          {CreatorLinks.name}
        </TextLink>
      </p>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        theme === "dark" ? "text-mute" : "text-muted",
        className,
      )}
    >
      <p className="text-sm">
        {AppStrings.creator.attributionPrefix}{" "}
        <TextLink className={linkClassName} external href={portfolioHref}>
          {CreatorLinks.name}
        </TextLink>
      </p>
      <div className="flex flex-wrap gap-4 text-sm">
        <TextLink className={linkClassName} external href={portfolioHref}>
          {AppStrings.creator.portfolioLabel}
        </TextLink>
        <TextLink className={linkClassName} external href={githubHref}>
          {AppStrings.creator.githubLabel}
        </TextLink>
        <TextLink
          className={linkClassName}
          external
          href={CreatorLinks.repoUrl}
        >
          {AppStrings.creator.repoLabel}
        </TextLink>
      </div>
    </div>
  );
}
