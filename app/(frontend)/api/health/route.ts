import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { isCMSConfigured, isStorageConfigured } from "@/src/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isCMSConfigured()) {
    return NextResponse.json(
      {
        status: "unavailable",
        database: "not-configured",
        storage: isStorageConfigured() ? "configured" : "not-configured",
      },
      { status: 503 },
    );
  }

  try {
    const payload = await getPayload({ config });
    await payload.count({
      collection: "users",
      overrideAccess: true,
    });
    return NextResponse.json({
      status: "ok",
      database: "connected",
      storage: isStorageConfigured() ? "configured" : "not-configured",
    });
  } catch {
    return NextResponse.json(
      {
        status: "unavailable",
        database: "disconnected",
        storage: isStorageConfigured() ? "configured" : "not-configured",
      },
      { status: 503 },
    );
  }
}
