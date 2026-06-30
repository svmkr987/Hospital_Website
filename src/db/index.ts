import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema.js';
import { serverConfig } from '../serverConfig.js';

export const createPool = () => {
  const connectionString = serverConfig.dbUrl;
  
  if (!connectionString) {
    console.warn("WARNING: DATABASE_URL is not set in environment variables or serverConfig.ts. Database connections will fail.");
  }
  
  return new Pool({
    connectionString: connectionString,
    connectionTimeoutMillis: 15000,
  });
};

const pool = createPool();

pool.on('error', (err) => {
  console.error('Unexpected error on idle SQL pool client:', err);
});

export const db = drizzle(pool, { schema });
