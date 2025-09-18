import { drizzle } from "drizzle-orm/neon-serverless";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import { config } from "dotenv";
import ws from "ws";

// Load environment variables from .env file
config();

// Configure WebSocket for Neon's serverless driver
if (!process.env.NODE_ENV?.includes('production')) {
  neonConfig.webSocketConstructor = ws;
}

// Create a persistent PostgreSQL connection
const sql = neon(process.env.DATABASE_URL || "", {
  poolSize: 1,
  connectionTimeoutMillis: 5000,
});

// Initialize Drizzle with the connection
export const db = drizzle(sql, { schema });