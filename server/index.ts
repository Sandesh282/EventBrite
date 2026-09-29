/**
 * server/index.ts
 *
 * Custom Next.js server using Express + Socket.IO.
 *
 * WHY A CUSTOM SERVER?
 * ─────────────────────
 * Next.js API routes run as serverless functions on Vercel — stateless,
 * short-lived, no persistent connections. Socket.IO requires:
 *   1. A persistent HTTP server (for the WebSocket upgrade handshake)
 *   2. In-memory state (rooms, connected clients)
 *   3. A single process to fanout events to all subscribers
 *
 * Solution: replace `next dev` / `next start` with this custom server that:
 *   - Creates an Express app + HTTP server
 *   - Attaches Socket.IO to the same HTTP server
 *   - Uses Next.js as a request handler for all other routes (pages, API)
 *   - Stores the Socket.IO instance in the lib/io.ts singleton
 *     so registration route handlers can emit seat updates
 *
 * PROCESS FLOW:
 *   1. Next.js prepares (compiles routes, etc.)
 *   2. HTTP server created from Express app
 *   3. Socket.IO attached to HTTP server
 *   4. IO singleton registered (setIO)
 *   5. Socket.IO handlers wired (registerSocketHandlers)
 *   6. Express passes ALL requests to Next.js (no REST duplication)
 *   7. Server listens on PORT (default: 3000)
 *
 * DEGRADATION:
 *   When deployed to Vercel (which uses its own server infrastructure),
 *   this file is NOT used. The app runs normally without real-time.
 *   The `getIO()` calls in route handlers return null → silent no-ops.
 *
 * HOW TO RUN:
 *   npm run dev:server    — development (tsx watch, HMR via Next.js)
 *   npm run start:server  — production (tsx, no HMR)
 *
 * ARCHITECTURE DIAGRAM:
 *
 *   Browser/Client
 *       │
 *       ├── HTTP (pages, REST API) ──→ Express → Next.js Handler → Route Handler
 *       │                                                               │
 *       └── WebSocket ──────────────→ Socket.IO ────────── Seat Updates ┘
 *                                        │
 *                                   Event Rooms
 *                                  event:{slug}
 */

import { createServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import express from "express"
import next from "next"
import { setIO } from "@/lib/io"
import { registerSocketHandlers } from "./socket"
import { logger } from "@/lib/logger"

const dev  = process.env.NODE_ENV !== "production"
const port = parseInt(process.env.PORT ?? "3000", 10)

async function main() {
  // Step 1: Prepare Next.js (compile routes, warm module cache)
  const nextApp = next({ dev })
  const handle  = nextApp.getRequestHandler()
  await nextApp.prepare()
  logger.info("Next.js ready")

  // Step 2: Create Express app + raw HTTP server
  const app        = express()
  const httpServer = createServer(app)

  // Step 3: Attach Socket.IO to the HTTP server
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin:  dev ? "*" : process.env.NEXT_PUBLIC_APP_URL ?? "*",
      methods: ["GET", "POST"],
    },
    // Prefer WebSocket transport; fall back to long-polling
    transports: ["websocket", "polling"],
    // Ping every 25s, timeout after 20s of silence
    pingInterval: 25_000,
    pingTimeout:  20_000,
  })

  // Step 4: Register the io singleton so route handlers can emit events
  setIO(io)
  logger.info("Socket.IO attached to HTTP server")

  // Step 5: Register Socket.IO connection and event handlers
  registerSocketHandlers(io)

  // Step 6: Pass ALL HTTP requests to Next.js
  // Express handles the HTTP upgrade (WebSocket) before Next.js sees it.
  // Note: app.all("*") was removed in Express 5 — app.use() is the equivalent.
  app.use((req, res) => {
    handle(req, res)
  })

  // Step 7: Start listening
  httpServer.listen(port, () => {
    logger.info({ port, mode: dev ? "development" : "production" }, `Server listening on :${port}`)
    if (dev) {
      logger.info(`  App:       http://localhost:${port}`)
      logger.info(`  API:       http://localhost:${port}/api/events`)
      logger.info(`  Socket.IO: ws://localhost:${port}`)
      logger.info(`  API Docs:  http://localhost:${port}/api/docs`)
    }
  })
}

main().catch((err) => {
  logger.error({ err }, "Server failed to start")
  process.exit(1)
})
