import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Sin este listener, un error en una conexión idle del pool emite un 'error'
// no capturado que tumba el proceso entero.
pool.on("error", (err) => {
  console.error("[db] idle pool error:", err);
});

export const db = drizzle(pool, { schema });
