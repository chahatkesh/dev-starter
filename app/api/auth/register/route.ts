import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { registerSchema } from "@/lib/auth/validation";
import { corsHeaders } from "@/lib/cors";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";
import { registerUser } from "@/services/auth/auth-service";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`register:${clientIp}`, rateLimits.auth);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many registration attempts. Please try again later.",
      },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Get client info
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    // Register user
    const result = await registerUser(validatedData, ip, userAgent);

    logger.info(
      {
        userId: result.user.id,
        email: result.user.email,
        ip,
      },
      "User registered",
    );

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Registration successful",
      },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn({ issues: error.issues }, "Registration validation failed");
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.issues,
        },
        { status: 400, headers: corsHeaders },
      );
    }

    if (error instanceof Error) {
      logger.error({ error: error.message }, "Registration failed");
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400, headers: corsHeaders },
      );
    }

    logger.error(
      { error: String(error) },
      "Registration failed with unknown error",
    );
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
