/**
 * lib/middleware/withLogging.ts
 *
 * Higher-order function that wraps a Next.js route handler with:
 *   1. Request ID generation (UUID v4, or forwarded from upstream proxy)
 *   2. Structured request/response logging (pino)
 *   3. Response time measurement
 *   4. Error logging (unexpected errors only — typed errors logged at warn level)
 *
 * Usage:
 *   export const GET = withLogging(async (req) => {
 *     // handler logic
 *   })
 *
 * Why a HOF instead of Next.js middleware.ts?
 *   Next.js middleware runs in the Edge runtime and cannot import Node.js
 *   modules like pino. A handler wrapper runs in the Node.js runtime
 *   where pino is available. The tradeoff: logging must be applied
 *   per-handler rather than globally. For a portfolio project this is fine;
 *   in production, a reverse proxy (nginx, Vercel) handles access logs
 *   and pino handles application-level structured events.
 *
 * Request ID forwarding:
 *   If an upstream service (API gateway, load balancer) sends
 *   X-Request-ID, we use that value so the ID is consistent across
 *   the entire distributed trace. If none is provided, we generate one.
 *   The ID is echoed back in the response header for client-side correlation.
 */

import { NextRequest, NextResponse } from "next/server"
import { createRequestLogger } from "@/lib/logger"

type RouteHandler = (
  req: NextRequest,
  ctx?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse> | NextResponse

/**
 * withLogging — wraps a Next.js route handler with structured logging.
 *
 * @param handler  The route handler to wrap
 * @returns        A new handler with logging applied
 */
export function withLogging(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    const start     = Date.now()
    const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID()
    const log       = createRequestLogger(requestId)

    log.info({
      method: req.method,
      path:   req.nextUrl.pathname,
      query:  Object.fromEntries(req.nextUrl.searchParams),
    }, "→ request")

    let res: NextResponse
    try {
      res = await handler(req, ctx)
    } catch (err) {
      const ms = Date.now() - start
      log.error({ err, ms }, "✗ unhandled error")
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500, headers: { "X-Request-ID": requestId } }
      )
    }

    const ms     = Date.now() - start
    const status = res.status
    const level  = status >= 500 ? "error" : status >= 400 ? "warn" : "info"

    log[level]({ status, ms }, `← response ${status} (${ms}ms)`)

    // Echo request ID in response header for client-side correlation
    res.headers.set("X-Request-ID", requestId)
    return res
  }
}
