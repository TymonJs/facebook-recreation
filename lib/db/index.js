import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const globalPool = globalThis.__pgPool;
const pool = globalPool ?? new Pool({ connectionString });

if (!globalPool && process.env.NODE_ENV !== "production") {
  globalThis.__pgPool = pool;
}

export const db = drizzle(pool, { schema });
export { pool };
