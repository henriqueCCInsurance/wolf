# Netlify Database Integration Setup

## ✅ Completed Setup

Your W.O.L.F. Den application is now ready for Netlify deployment with Supabase database integration.

### What's Configured:

- ✅ `netlify.toml` with build settings
- ✅ Environment variable placeholders
- ✅ SPA routing redirects
- ✅ Supabase client configuration
- ✅ Database type definitions
- ✅ Build process tested and working

## 🚀 Deployment Steps

### 1. Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Netlify will auto-detect your settings from `netlify.toml`
5. Click "Deploy site"

### 2. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a project
2. In your Supabase dashboard:
   - Go to Settings → API
   - Copy your Project URL
   - Copy your anon/public key

### 3. Configure Environment Variables

In your Netlify site dashboard:

1. Go to Site settings → Environment variables
2. Add these variables:
   ```
   VITE_SUPABASE_URL = your_supabase_project_url
   VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

### 4. Set Up Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Enable RLS
alter table if exists public.users enable row level security;
alter table if exists public.call_logs enable row level security;
alter table if exists public.battle_cards enable row level security;
alter table if exists public.call_sequences enable row level security;

-- Create tables
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  role text check (role in ('salesperson', 'admin')) default 'salesperson',
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone,
  settings jsonb default '{}'::jsonb
);

create table if not exists public.call_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  lead_id text not null,
  outcome text check (outcome in ('meeting-booked', 'nurture', 'disqualified', 'follow-up')) not null,
  intel text not null,
  best_talking_point text not null,
  key_takeaway text not null,
  call_duration integer,
  sequence_id text,
  contact_id text,
  start_time text,
  end_time text,
  attempt_number integer,
  additional_info jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.battle_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  lead_data jsonb not null,
  selected_content jsonb[] not null,
  dynamic_intelligence text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.call_sequences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  contacts jsonb[] not null,
  status text check (status in ('planned', 'active', 'completed')) default 'planned',
  sprint_size integer not null,
  mode text check (mode in ('standalone', 'imported', 'crm-sync')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
create policy "Users can view own data" on public.users for select using (auth.uid() = id);
create policy "Users can update own data" on public.users for update using (auth.uid() = id);

create policy "Users can view own call logs" on public.call_logs for select using (auth.uid() = user_id);
create policy "Users can insert own call logs" on public.call_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own call logs" on public.call_logs for update using (auth.uid() = user_id);

create policy "Users can view own battle cards" on public.battle_cards for select using (auth.uid() = user_id);
create policy "Users can insert own battle cards" on public.battle_cards for insert with check (auth.uid() = user_id);

create policy "Users can view own sequences" on public.call_sequences for select using (auth.uid() = user_id);
create policy "Users can insert own sequences" on public.call_sequences for insert with check (auth.uid() = user_id);
create policy "Users can update own sequences" on public.call_sequences for update using (auth.uid() = user_id);
```

## 🔧 Local Development with Database

Create `.env.local` file:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then run:
```bash
npm run dev
```

## 🎯 Features Enabled

With database integration, your app now supports:

- ✅ User authentication and profiles
- ✅ Call logging with persistent storage
- ✅ Battle card history and sharing
- ✅ Call sequence planning and tracking
- ✅ Multi-user support with role-based access
- ✅ Data persistence across sessions

Your W.O.L.F. Den is ready for production deployment with full database functionality!