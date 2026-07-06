import { NextResponse, type NextRequest } from "next/server";
import { getPostLoginPath } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }

  if (pathname.startsWith("/app")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if ((pathname === "/login" || pathname === "/signup") && session) {
    return NextResponse.redirect(
      new URL(getPostLoginPath(session.role), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/app/:path*", "/login", "/signup"],
};
