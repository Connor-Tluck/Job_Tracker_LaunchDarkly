import { NextRequest, NextResponse } from "next/server";
import { getLDServerClient, convertToLDContext } from "@/lib/launchdarkly/serverClient";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { configKey, userContext } = body || {};

    if (!configKey || !userContext) {
      return NextResponse.json(
        { error: "Missing configKey or userContext" },
        { status: 400 }
      );
    }

    const ldClient = await getLDServerClient();
    if (!ldClient) {
      return NextResponse.json(
        { error: "LaunchDarkly server client not available" },
        { status: 500 }
      );
    }

    const ldContext = convertToLDContext(userContext);
    const detail = await ldClient.variationDetail(configKey, ldContext, null);

    return NextResponse.json({
      variationIndex: detail?.variationIndex ?? null,
      reason: detail?.reason ?? null,
      value: detail?.value ?? null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to evaluate AI config", details: error?.message },
      { status: 500 }
    );
  }
}
