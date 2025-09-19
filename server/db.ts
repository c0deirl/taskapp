import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../shared/schema";
import { config } from "dotenv";
import winston from 'winston';

// Configure logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Load environment variables from .env file
config();

// Create a SQLite database connection
const sqlite = new Database('dev.db', {
  verbose: console.log
});

// Initialize Drizzle with SQLite
export const db = drizzle(sqlite, { schema });

try {
  // Test database connection
  db.select().from(schema.users).limit(1).all();
  logger.info('Database connection established successfully');
} catch (error) {
  logger.error('Failed to establish database connection:', { error });
  throw error;
}