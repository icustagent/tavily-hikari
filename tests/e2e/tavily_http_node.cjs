#!/usr/bin/env node

/**
 * Simple end-to-end smoke test for the Tavily HTTP proxy using the official
 * JavaScript SDK `@tavily/core`.
 *
 * Requirements:
 * - Tavily Hikari backend running locally (e.g. via scripts/start-backend-dev.sh)
 * - TAVILY_USAGE_BASE configured to point at a mock Tavily HTTP upstream
 * - HIKARI_TAVILY_TOKEN (or TAVILY_HIKARI_TOKEN) set to a valid Hikari access token
 *
 * The test sends a single search request through the SDK with apiBaseURL
 * overridden to point at Hikari's `/api/tavily` façade and performs basic
 * structural assertions on the response.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const { tavily } = require("@tavily/core");

async function main() {
  const baseUrl =
    process.env.HIKARI_TAVILY_BASE_URL ||
    "http://127.0.0.1:58087/api/tavily";
  const apiKey =
    process.env.HIKARI_TAVILY_TOKEN || process.env.TAVILY_HIKARI_TOKEN;

  if (!apiKey) {
    console.error(
      "Missing Hikari access token: set HIKARI_TAVILY_TOKEN or TAVILY_HIKARI_TOKEN.",
    );
    process.exit(1);
  }

  console.log(`Using Tavily HTTP base URL: ${baseUrl}`);

  const client = tavily({
    apiKey,
    apiBaseURL: baseUrl,
  });

  try {
    const response = await client.search(
      "tavily hikari http proxy e2e smoke test",
      {
        searchDepth: "basic",
        maxResults: 3,
        includeAnswer: false,
        includeImages: false,
        includeRawContent: false,
      },
    );

    if (!response || !Array.isArray(response.results)) {
      throw new Error("Unexpected Tavily response shape (missing results array)");
    }

    console.log(
      `Search OK: query="${response.query}", results=${response.results.length}, responseTime=${response.responseTime}`,
    );

    const first = response.results[0];
    if (first) {
      if (typeof first.url !== "string" || typeof first.title !== "string") {
        throw new Error("First result is missing url/title fields");
      }
    }
  } catch (err) {
    console.error("E2E Tavily HTTP proxy test failed:", err);
    process.exit(1);
  }

  console.log("E2E Tavily HTTP proxy test passed.");
}

if (require.main === module) {
  main();
}

