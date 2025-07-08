import { neon } from '@netlify/neon';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

// Create database instance with error handling
let db: any;

try {
  // Check if we have the Netlify database URL
  const databaseUrl = process.env.NETLIFY_DATABASE_URL;
  
  if (databaseUrl) {
    // Production: Use Netlify database
    db = drizzle({
      schema,
      client: neon(databaseUrl)
    });
  } else {
    // Development/fallback: Use mock database
    console.warn('Netlify database not configured. Using mock database.');
    db = {
      select: () => ({ from: () => ({ where: () => ({ limit: () => [] }) }) }),
      insert: () => ({ values: () => ({ returning: () => [{ id: 'mock-id' }] }) }),
      update: () => ({ set: () => ({ where: () => ({ returning: () => [{ id: 'mock-id' }] }) }) }),
      delete: () => ({ where: () => ({ returning: () => [{ id: 'mock-id' }] }) })
    };
  }
} catch (error) {
  console.error('Database initialization error:', error);
  // Fallback to mock database
  db = {
    select: () => ({ from: () => ({ where: () => ({ limit: () => [] }) }) }),
    insert: () => ({ values: () => ({ returning: () => [{ id: 'mock-id' }] }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [{ id: 'mock-id' }] }) }) }),
    delete: () => ({ where: () => ({ returning: () => [{ id: 'mock-id' }] }) })
  };
}

export { db };

// Export schema and types
export * from './schema';