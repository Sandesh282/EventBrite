/**
 * server/socket.ts
 *
 * Socket.IO event handlers for EventBrite.
 *
 * REAL-TIME FEATURE: Live seat availability
 * ─────────────────────────────────────────
 * When attendees view an event page, they join a Socket.IO room named
 * after the event slug. When a registration is confirmed or cancelled,
 * the registration route handler emits `seats:updated` to that room.
 * All connected clients immediately see the updated seat count without
 * polling.
 *
 * ROOMS:
 *   Room name format: `event:{slug}`  (e.g. `event:viacom`)
 *   Each event has its own room — updates are scoped, not broadcast globally.
 *
 * EVENTS (client → server):
 *   join:event   { slug: string }  — subscribe to seat updates for an event
 *   leave:event  { slug: string }  — unsubscribe from an event's updates
 *   ping                           — connectivity check (server responds: pong)
 *
 * EVENTS (server → client):
 *   seats:updated  { slug, confirmedCount, capacity, seatsRemaining }
 *     Emitted to `event:{slug}` room after any registration change.
 *     `seatsRemaining: null` means unlimited capacity.
 *
 *   registration:confirmed  { slug, registrationId }
 *     Emitted only to the registering user's socket for optimistic UI.
 *
 *   pong  — response to client ping (for latency measurement)
 *
 * AUTHENTICATION:
 *   Socket.IO connections use the same Bearer token as the REST API.
 *   The token is passed in the handshake auth object:
 *     const socket = io('http://localhost:3001', { auth: { token: accessToken } })
 *   The middleware verifies it and attaches userId to socket.data.
 *   Unauthenticated sockets can still JOIN event rooms (read-only seat watching)
 *   but cannot receive personal events.
 */

import type { Server as SocketIOServer, Socket } from "socket.io"
import { verifyAccessToken } from "@/lib/auth/jwt"
import { logger } from "@/lib/logger"

export function registerSocketHandlers(io: SocketIOServer): void {
  // ---------------------------------------------------------------------------
  // Auth middleware — verify JWT on connection (optional, degrades gracefully)
  // ---------------------------------------------------------------------------
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined

    if (!token) {
      // Allow unauthenticated connections — they can watch seat counts
      socket.data.userId = null
      socket.data.role   = null
      return next()
    }

    try {
      const payload       = await verifyAccessToken(token)
      socket.data.userId  = parseInt(payload.sub ?? "", 10)
      socket.data.role    = payload.role
      logger.info({ socketId: socket.id, userId: socket.data.userId }, "socket authenticated")
    } catch {
      // Expired/invalid token — still allow connection but as anonymous
      socket.data.userId = null
      socket.data.role   = null
    }

    next()
  })

  // ---------------------------------------------------------------------------
  // Connection handler
  // ---------------------------------------------------------------------------
  io.on("connection", (socket: Socket) => {
    const log = logger.child({ socketId: socket.id, userId: socket.data.userId })
    log.info("socket connected")

    // ── join:event ────────────────────────────────────────────────────────────
    // Client subscribes to live seat updates for a specific event.
    socket.on("join:event", ({ slug }: { slug: string }) => {
      if (!slug || typeof slug !== "string") return

      const room = `event:${slug}`
      socket.join(room)
      log.debug({ room, slug }, "joined event room")

      // Acknowledge join
      socket.emit("joined:event", { slug })
    })

    // ── leave:event ───────────────────────────────────────────────────────────
    socket.on("leave:event", ({ slug }: { slug: string }) => {
      if (!slug || typeof slug !== "string") return

      const room = `event:${slug}`
      socket.leave(room)
      log.debug({ room, slug }, "left event room")
    })

    // ── ping ─────────────────────────────────────────────────────────────────
    socket.on("ping", () => {
      socket.emit("pong", { timestamp: Date.now() })
    })

    // ── disconnect ────────────────────────────────────────────────────────────
    socket.on("disconnect", (reason) => {
      log.info({ reason }, "socket disconnected")
    })
  })
}

// ---------------------------------------------------------------------------
// emitSeatsUpdated — called by registration route handlers after any change.
//
// Emits `seats:updated` to all clients watching the event room.
// Safe to call when io is null (Vercel/serverless) — no-op.
// ---------------------------------------------------------------------------
export function emitSeatsUpdated(
  io: SocketIOServer | null,
  opts: {
    slug:           string
    confirmedCount: number
    capacity:       number | null
  }
): void {
  if (!io) return

  const room = `event:${opts.slug}`
  const seatsRemaining = opts.capacity !== null
    ? Math.max(0, opts.capacity - opts.confirmedCount)
    : null

  io.to(room).emit("seats:updated", {
    slug:           opts.slug,
    confirmedCount: opts.confirmedCount,
    capacity:       opts.capacity,
    seatsRemaining,
  })

  logger.debug({ room, ...opts, seatsRemaining }, "seats:updated emitted")
}
