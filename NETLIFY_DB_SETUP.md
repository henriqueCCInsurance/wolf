# Netlify DB (PostgreSQL) Setup Guide

## Overview

Your W.O.L.F. Den project is now configured to use Netlify DB, a native PostgreSQL database powered by Neon. This replaces the Supabase integration with a simpler, Netlify-native solution.

## Setup Status

### ✅ Completed:
- Drizzle ORM schema created for all tables
- Database connection configured
- Type-safe database access set up
- Migration scripts configured

### 📁 Database Files:
- `src/db/schema.ts` - Database schema with all tables
- `src/db/index.ts` - Database connection
- `drizzle-wolf.config.ts` - Drizzle configuration

## Deployment Steps

### 1. Deploy to Netlify

Push your code to GitHub, then in Netlify:
1. Import your GitHub repository
2. Netlify will auto-detect settings from `netlify.toml`

### 2. Enable Netlify DB

After deployment, in your Netlify dashboard:

1. Go to your site settings
2. Navigate to "Integrations" → "Database"
3. Click "Enable Netlify DB"
4. This will automatically:
   - Create a PostgreSQL database
   - Set the `NETLIFY_DATABASE_URL` environment variable
   - Connect it to your functions

### 3. Run Database Migrations

Once Netlify DB is enabled, you need to create the tables:

#### Option A: Using Netlify Web UI
1. Go to your site's "Functions" tab
2. Create a one-time function to run migrations
3. Deploy and trigger it once

#### Option B: Manual SQL (Recommended)
1. In Netlify dashboard, find your database connection details
2. Use a PostgreSQL client or Neon's web console
3. Run this SQL:

```sql
-- Create enums
CREATE TYPE user_role AS ENUM ('salesperson', 'admin');
CREATE TYPE call_outcome AS ENUM ('meeting-booked', 'nurture', 'disqualified', 'follow-up');
CREATE TYPE sequence_status AS ENUM ('planned', 'active', 'completed');
CREATE TYPE sequence_mode AS ENUM ('standalone', 'imported', 'crm-sync');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role user_role DEFAULT 'salesperson' NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    last_login TIMESTAMP,
    settings JSONB DEFAULT '{}'
);

-- Create call_logs table
CREATE TABLE call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lead_id TEXT NOT NULL,
    outcome call_outcome NOT NULL,
    intel TEXT NOT NULL,
    best_talking_point TEXT NOT NULL,
    key_takeaway TEXT NOT NULL,
    call_duration INTEGER,
    sequence_id TEXT,
    contact_id TEXT,
    start_time TEXT,
    end_time TEXT,
    attempt_number INTEGER,
    additional_info JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create battle_cards table
CREATE TABLE battle_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lead_data JSONB NOT NULL,
    selected_content JSONB NOT NULL,
    dynamic_intelligence TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create call_sequences table
CREATE TABLE call_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contacts JSONB NOT NULL,
    status sequence_status DEFAULT 'planned' NOT NULL,
    sprint_size INTEGER NOT NULL,
    mode sequence_mode NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_call_logs_user_id ON call_logs(user_id);
CREATE INDEX idx_battle_cards_user_id ON battle_cards(user_id);
CREATE INDEX idx_call_sequences_user_id ON call_sequences(user_id);
CREATE INDEX idx_users_email ON users(email);
```

## Update Your Code

### 1. Replace Supabase imports with Netlify DB:

```typescript
// OLD: import { supabase } from '@/lib/supabase';
// NEW:
import { db } from '@/db';
import { users, callLogs, battleCards, callSequences } from '@/db/schema';
```

### 2. Update database queries:

```typescript
// Example: Create a user
import { db } from '@/db';
import { users } from '@/db/schema';

const newUser = await db.insert(users).values({
  email: 'user@example.com',
  name: 'John Doe',
  role: 'salesperson'
}).returning();

// Example: Query call logs
const userCallLogs = await db
  .select()
  .from(callLogs)
  .where(eq(callLogs.userId, userId));
```

## Local Development

For local development with Netlify DB:

1. Install Netlify CLI when npm permissions are fixed:
   ```bash
   sudo chown -R $(whoami) ~/.npm
   npm install -g netlify-cli
   ```

2. Link your site:
   ```bash
   netlify link
   ```

3. Run with database access:
   ```bash
   netlify dev
   ```

## Benefits of Netlify DB

- **Zero Configuration**: Automatically connected to your functions
- **Type Safety**: Full TypeScript support with Drizzle ORM
- **Performance**: PostgreSQL with connection pooling
- **Simplicity**: No separate authentication or API keys needed
- **Cost Effective**: Included with Netlify plans

## Migration from Supabase

The schema is designed to be compatible with your existing Supabase structure. The main differences:
- No built-in authentication (use Netlify Identity or Auth0)
- Direct database access instead of REST API
- Simpler setup with automatic environment variables

Your W.O.L.F. Den is now ready for deployment with Netlify DB!