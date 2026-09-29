/**
 * lib/repositories/users.repo.ts
 *
 * All database queries for the users domain.
 * Auth service calls this — never imports db directly.
 */

import { eq } from "drizzle-orm"
import { db } from "@/db"
import * as schema from "@/db/schema"

// ---------------------------------------------------------------------------
// findByEmail — used during login to look up a user by their email address.
// Returns null if no matching user exists (caller handles 401).
// ---------------------------------------------------------------------------
export async function findByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email.toLowerCase().trim()),
  })
  return user ?? null
}

// ---------------------------------------------------------------------------
// findById — used by GET /api/auth/me and token refresh flows.
// Returns null if user has been deleted since the token was issued.
// ---------------------------------------------------------------------------
export async function findById(id: number) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
  })
  return user ?? null
}

// ---------------------------------------------------------------------------
// create — insert a new user row.
// email is normalised to lowercase before storage.
// passwordHash must be a bcrypt hash — caller is responsible for hashing.
// Throws with code "23505" if email already exists (caught in auth service).
// ---------------------------------------------------------------------------
export async function create(data: {
  email:        string
  name:         string
  passwordHash: string
  role?:        string
}) {
  const [user] = await db
    .insert(schema.users)
    .values({
      email:        data.email.toLowerCase().trim(),
      name:         data.name.trim(),
      passwordHash: data.passwordHash,
      role:         data.role ?? "attendee",
    })
    .returning({
      id:        schema.users.id,
      email:     schema.users.email,
      name:      schema.users.name,
      role:      schema.users.role,
      createdAt: schema.users.createdAt,
    })

  return user
}
