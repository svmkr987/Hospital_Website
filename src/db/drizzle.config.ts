import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { serverConfig } from "../../src/serverConfig.ts";

dotenv.config();

const databaseUrl = serverConfig.dbUrl;

if (!databaseUrl) {
  throw new Error("DATABASE_URL or POSTGRES_URL must be set in environment variables (or serverConfig.ts) to connect to Supabase/Vercel Postgres.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
});
