export const CreatorLinks = {
  name: "Chahat Kesharwani",
  portfolioUrl: "https://chahatkesh.me",
  githubUrl: "https://github.com/chahatkesh",
  repoUrl: "https://github.com/chahatkesh/dev-starter",
  utm: {
    source: "dev-starter",
    medium: "referral",
    campaign: "starter-clone",
  },
} as const;

export function withStarterAttribution(url: string): string {
  const parsed = new URL(url);
  parsed.searchParams.set("utm_source", CreatorLinks.utm.source);
  parsed.searchParams.set("utm_medium", CreatorLinks.utm.medium);
  parsed.searchParams.set("utm_campaign", CreatorLinks.utm.campaign);
  return parsed.toString();
}
