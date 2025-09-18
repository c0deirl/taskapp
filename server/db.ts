import { drizzle } from "drizzle-orm/neon-serverless";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "../shared/schema";
import { config } from "dotenv";
import ws from "ws";
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

// Configure WebSocket for Neon's serverless driver
if (!process.env.NODE_ENV?.includes('production')) {
  neonConfig.webSocketConstructor = ws;
  logger.debug('Configured WebSocket for development environment');
}

// Create a persistent PostgreSQL connection
try {
  const sql = neon(process.env.DATABASE_URL || "", {
    poolSize: 1,
    connectionTimeoutMillis: 5000,
  });
  
  // Initialize Drizzle with the connection
  export const db = drizzle(sql, { schema });
  logger.info('Database connection established successfully');
} catch (error) {
  logger.error('Failed to establish database connection:', { error });
  throw error;
}