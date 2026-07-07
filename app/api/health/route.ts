import { appConfig, getAppEnvironment } from "@/lib/app-config";
import { AppStrings } from "@shared/app-strings";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    status: AppStrings.health.statusOk,
    service: appConfig.name,
    environment: getAppEnvironment(),
    timestamp: new Date().toISOString(),
  });
}
