import { NextResponse } from "next/server";

export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
