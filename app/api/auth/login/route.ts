import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { loginSchema } from "@/lib/auth/validation";
import { corsHeaders } from "@/lib/cors";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";
import { loginUser } from "@/services/auth/auth-service";

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`login:${clientIp}`, rateLimits.auth);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many login attempts. Please try again later.",
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

  let email: string | undefined;
  try {
    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);
    email = validatedData.email;

    // Get client info
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    // Login user
    const result = await loginUser(validatedData, ip, userAgent);

    logger.info(
      {
        userId: result.user.id,
        email,
        ip,
      },
      "User logged in",
    );

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Login successful",
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn({ issues: error.issues }, "Login validation failed");
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
      logger.warn({ email, error: error.message }, "Login failed");
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401, headers: corsHeaders },
      );
    }

    logger.error({ error: String(error) }, "Login failed with unknown error");
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
