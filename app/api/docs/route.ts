/**
 * app/api/docs/route.ts
 *
 * GET /api/docs — serves the OpenAPI 3.1.0 specification as JSON.
 *
 * This enables Swagger UI, Redoc, or any OpenAPI tool to consume the spec
 * directly from the live server without requiring a separate docs deployment.
 *
 * Usage:
 *   curl http://localhost:3000/api/docs | jq .info
 *
 * To view in Swagger UI locally:
 *   npx swagger-ui-watcher http://localhost:3000/api/docs
 *
 * To view in Redoc:
 *   npx @redocly/cli preview-docs http://localhost:3000/api/docs
 */

import { NextResponse } from "next/server"
import spec from "@/docs/openapi.json"

export async function GET() {
  return NextResponse.json(spec, {
    headers: {
      // Allow Swagger UI / Redoc running on any origin to fetch this spec
      "Access-Control-Allow-Origin": "*",
      // Hint to clients that this is an OpenAPI document
      "Content-Type": "application/json",
      // Cache for 5 minutes — spec doesn't change per-request
      "Cache-Control": "public, max-age=300",
    },
  })
}
