import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const BASE_URL = "https://app.launchdarkly.com";

function loadConfig() {
  const configPath = path.join(process.cwd(), "ld-config.json");
  if (!fs.existsSync(configPath)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const configKey = searchParams.get("configKey");
  const config = loadConfig();
  const projectKey =
    searchParams.get("projectKey") ||
    config.projectKey ||
    process.env.LAUNCHDARKLY_PROJECT_KEY;

  if (!configKey || !projectKey) {
    return NextResponse.json(
      { error: "Missing configKey or projectKey" },
      { status: 400 }
    );
  }

  const accessToken =
    process.env.LAUNCHDARKLY_ACCESS_TOKEN || process.env.LD_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing LaunchDarkly access token" },
      { status: 500 }
    );
  }

  const url = `${BASE_URL}/api/v2/projects/${projectKey}/ai-configs/${configKey}/targeting`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: accessToken.startsWith("api-")
          ? accessToken
          : `api-${accessToken}`,
        "Content-Type": "application/json",
        "LD-API-Version": "beta",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch targeting", details: error?.message },
      { status: 500 }
    );
  }
}
