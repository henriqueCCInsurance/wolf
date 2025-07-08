# Supabase Database Setup Guide

This guide will walk you through setting up Supabase for the W.O.L.F. Den application.

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "Start your project"
4. Create a new organization (if needed)
5. Create a new project:
   - **Name**: `wolf-den-database`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your location

## 2. Get Your Credentials

1. Wait for the project to be created (2-3 minutes)
2. Go to **Settings** > **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiI...`)

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 4. Create Database Schema

The application will automatically create the necessary tables. The schema includes:

### Tables
- **users** - User profiles and settings
- **call_logs** - Call history and outcomes
- **battle_cards** - Generated battle cards
- **call_sequences** - Call planning sequences

### Row Level Security (RLS)
All tables will have RLS enabled to ensure users can only access their own data.

## 5. Enable Authentication

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Configure these settings:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: `http://localhost:5173/**` (for development)
3. Enable email confirmation (recommended)
4. Configure social providers (optional):
   - Google OAuth
   - GitHub OAuth

## 6. Test the Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`
3. Try creating an account - you should see the data in Supabase!

## Next Steps

Once the basic setup is working:
1. Configure for production deployment (Netlify)
2. Set up real-time subscriptions
3. Add data validation rules
4. Configure backup policies

## Troubleshooting

**Connection Issues:**
- Verify environment variables are correct
- Check Supabase project is active
- Ensure URL doesn't have trailing slashes

**Authentication Issues:**
- Check Site URL matches your domain
- Verify redirect URLs are configured
- Ensure email templates are working

**Permission Issues:**
- Check Row Level Security policies
- Verify user is authenticated
- Review database logs in Supabase dashboard