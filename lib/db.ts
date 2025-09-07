import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

config();

// Use local PostgreSQL for development/production
const connectionString = process.env.DATABASE_URL || `postgresql://devuser:devpass123@192.168.1.12:5432/devdb`;

const client = postgres(connectionString);
export const db = drizzle(client);
