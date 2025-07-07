import { neon } from '@netlify/neon';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

// Create database instance
export const db = drizzle({
    schema,
    client: neon()
});

// Export schema and types
export * from './schema';