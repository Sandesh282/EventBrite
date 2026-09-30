/**
 * lib/io.ts
 *
 * Socket.IO server singleton accessor.
 *
 * WHY A SINGLETON?
 * ─────────────────
 * The custom server (server.ts) creates one Socket.IO instance at startup
 * and needs to make it accessible to Next.js route handlers so they can
 * emit events after registrations change.
 *
 * We can't import `io` from server.ts directly because:
 *   1. server.ts creates io *after* async initialisation (next.prepare())
 *   2. Circular imports between server.ts and route handlers would cause issues
 *
 * A module-level singleton solves this cleanly:
 *   - server.ts calls setIO(io) once at startup
 *   - Any route handler calls getIO() to emit events
 *   - Returns null in environments without the custom server (Vercel, next dev)
 *     — callers must handle null gracefully (real-time degrades silently)
 *
 * DEGRADATION STRATEGY:
 *   if (io) io.to(room).emit(...)  ← silent no-op when not using custom server
 *
 * This means the REST API continues to work perfectly without Socket.IO;
 * real-time updates are an enhancement, not a dependency.
 */

import type { Server as SocketIOServer } from "socket.io"

let _io: SocketIOServer | null = null

export function setIO(instance: SocketIOServer): void {
  _io = instance
}

export function getIO(): SocketIOServer | null {
  return _io
}
