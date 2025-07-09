import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';
import * as fs from 'fs';
import * as path from 'path';

const handler: Handler = async (event, _context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check for admin authorization (you should implement proper auth)
  const authHeader = event.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.MIGRATION_SECRET}`) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    const databaseUrl = process.env.NETLIFY_DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('Database URL not configured');
    }

    const sql = neon(databaseUrl);
    
    // Read migration files
    const migrationsDir = path.join(__dirname, '../../drizzle/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure migrations run in order

    const results = [];
    
    for (const file of migrationFiles) {
      try {
        const migrationSql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        
        // Split by semicolons to handle multiple statements
        const statements = migrationSql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        for (const statement of statements) {
          await sql`${statement}`;
        }
        
        results.push({
          file,
          status: 'success',
          message: `Migration ${file} applied successfully`
        });
      } catch (error) {
        results.push({
          file,
          status: 'error',
          message: error.message
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Migrations completed',
        results
      })
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Migration failed',
        details: error.message
      })
    };
  }
};

export { handler };