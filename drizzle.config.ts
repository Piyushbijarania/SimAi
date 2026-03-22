import { resolve } from "path";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit does not load .env.local — Next.js does. Mirror Next’s precedence.
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl?.trim()) {
  throw new Error(
    "DATABASE_URL is missing. Add it to .env.local (or .env) and run db:push again."
  );
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
