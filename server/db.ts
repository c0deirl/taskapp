import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Create a PostgreSQL connection
const sql = neon(process.env.DATABASE_URL || "");
export const db = drizzle(sql, { schema });