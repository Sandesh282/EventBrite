import { defineConfig } from "drizzle-kit"
import { readFileSync } from "fs"
import { resolve } from "path"

// drizzle-kit is a standalone CLI — it does NOT auto-load .env.local
// the way Next.js does. We parse it manually with zero extra dependencies.
try {
  const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8")
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const [key, ...rest] = trimmed.split("=")
    if (key && !process.env[key]) {
      process.env[key] = rest.join("=")
    }
  }
} catch {
  // .env.local absent — rely on process.env (e.g. Vercel injects vars directly)
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle/migrations",
  // Use 'postgresql' dialect with the 'postgres' TCP driver for CLI tools.
  // @neondatabase/serverless only supports WebSocket — it cannot be used by
  // drizzle-kit migrate from a local terminal session.
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
