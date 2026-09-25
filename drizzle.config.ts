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
  // Schema file that drizzle-kit reads to generate migrations
  schema: "./db/schema.ts",
  // Migration SQL files are written here — commit these to version control
  out: "./drizzle/migrations",
  // Use 'postgresql' dialect with the 'postgres' TCP driver for CLI tools.
  // @neondatabase/serverless only supports WebSocket — it cannot be used by
  // drizzle-kit migrate from a local terminal session.
  dialect: "postgresql",
  dbCredentials: {
    // DATABASE_URL must be set when running db:generate / db:migrate
    url: process.env.DATABASE_URL!,
  },
})
