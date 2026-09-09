import { defineConfig } from "drizzle-kit"

export default defineConfig({
  // Schema file that drizzle-kit reads to generate migrations
  schema: "./db/schema.ts",
  // Migration SQL files are written here — commit these to version control
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // DATABASE_URL must be set when running db:generate / db:migrate
    url: process.env.DATABASE_URL!,
  },
})
