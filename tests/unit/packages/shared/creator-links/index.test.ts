import { CreatorLinks, withStarterAttribution } from "@shared/creator-links";
import { describe, expect, it } from "vitest";

describe("creator links", () => {
  it("exposes starter creator profile links", () => {
    expect(CreatorLinks.name).toBe("Chahat Kesharwani");
    expect(CreatorLinks.portfolioUrl).toBe("https://chahatkesh.me");
    expect(CreatorLinks.githubUrl).toBe("https://github.com/chahatkesh");
  });

  it("adds referral utm params for clone attribution", () => {
    expect(withStarterAttribution(CreatorLinks.portfolioUrl)).toBe(
      "https://chahatkesh.me/?utm_source=dev-starter&utm_medium=referral&utm_campaign=starter-clone",
    );
    expect(withStarterAttribution(CreatorLinks.githubUrl)).toBe(
      "https://github.com/chahatkesh?utm_source=dev-starter&utm_medium=referral&utm_campaign=starter-clone",
    );
  });
});
