import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { logger } from "@/lib/logger";
import { logoutUser } from "@/services/auth/auth-service";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST() {
  try {
    await logoutUser();

    logger.info("User logged out");

    return NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Logout failed",
    );
    return NextResponse.json(
      {
        success: false,
        error: "Failed to logout",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
