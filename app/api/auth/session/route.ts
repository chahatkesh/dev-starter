import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { corsHeaders } from "@/lib/cors";
import { logger } from "@/lib/logger";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
        },
        { status: 401, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        data: {
          user,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Failed to get session",
    );
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: "Failed to get session",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
