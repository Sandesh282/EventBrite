/**
 * lib/logger.ts
 *
 * Structured logger for EventBrite using pino.
 *
 * Why structured logging (JSON) over console.log()?
 * ──────────────────────────────────────────────────
 * console.log() outputs unstructured plain text. In production:
 *   - You can't filter logs by error level without grep
 *   - You can't query "all requests that took > 500ms"
 *   - You can't correlate a slow request to a specific user
 *   - Log aggregators (Datadog, Logflare, Axiom) can't parse it reliably
 *
 * Pino outputs newline-delimited JSON:
 *   {"level":30,"time":1727000000000,"requestId":"abc-123","msg":"GET /api/events","ms":45}
 *
 * This is machine-parseable, searchable, and directly ingestible by
 * any log aggregator without custom parsing rules.
 *
 * Why pino over winston?
 *   Pino is the fastest Node.js logger (~5× faster than winston in benchmarks).
 *   It achieves this by doing minimal work on the hot path and delegating
 *   pretty-printing to a separate worker process (pino-pretty).
 *   In production: raw JSON (fast). In development: piped through pino-pretty.
 *
 * Request correlation:
 *   Each request gets a unique requestId (UUID). The logger is bound to this ID
 *   via logger.child({ requestId }) so every log line within a request
 *   automatically includes the ID — critical for tracing errors across services.
 *
 * Log levels used:
 *   logger.info()  — normal request lifecycle events
 *   logger.warn()  — recoverable issues (e.g. 404, auth failure)
 *   logger.error() — unexpected errors that reach the handler's catch block
 *   logger.debug() — detailed tracing, disabled in production
 */

import pino from "pino"

const isDev = process.env.NODE_ENV !== "production"

export const logger = pino({
  level: isDev ? "debug" : "info",

  // In development: pretty-print with colors for human readability.
  // In production: raw JSON for log aggregators.
  // NOTE: transport is NOT used in production (adds overhead).
  ...(isDev
    ? {
        transport: {
          target:  "pino-pretty",
          options: {
            colorize:        true,
            translateTime:   "SYS:HH:MM:ss.l",
            ignore:          "pid,hostname",
            messageFormat:   "{requestId} {msg}",
          },
        },
      }
    : {}),

  // Base fields on every log line
  base: {
    service: "eventbrite-api",
    env:     process.env.NODE_ENV ?? "development",
  },

  // Redact sensitive fields — these are stripped before any log is written.
  // This prevents secrets from leaking into log aggregators even if a
  // developer accidentally logs a request body containing a password.
  redact: {
    paths:  ["*.password", "*.passwordHash", "*.authorization", "*.cookie"],
    censor: "[REDACTED]",
  },
})

/**
 * createRequestLogger — bind a requestId to a child logger.
 *
 * Every log line emitted from this child will include { requestId }
 * automatically, enabling end-to-end request tracing across log lines.
 *
 * Usage in a route handler:
 *   const log = createRequestLogger(requestId)
 *   log.info({ method: "POST", path: "/api/events" }, "Request started")
 *   log.error({ err }, "Unexpected error")
 */
export function createRequestLogger(requestId: string) {
  return logger.child({ requestId })
}
