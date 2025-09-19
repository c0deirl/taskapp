import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";

// Create a database connection
const sqlite = new Database("dev.db");
const db = drizzle(sqlite);

// Run migrations
console.log("Running migrations...");
migrate(db, { migrationsFolder: "./migrations" });
console.log("Migrations complete!");