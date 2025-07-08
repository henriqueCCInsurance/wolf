-- W.O.L.F. Den Database Schema
-- Run this in your Supabase SQL Editor

-- Create custom types
CREATE TYPE user_role AS ENUM ('salesperson', 'admin');
CREATE TYPE call_outcome AS ENUM ('meeting-booked', 'nurture', 'disqualified', 'follow-up');
CREATE TYPE sequence_status AS ENUM ('planned', 'active', 'completed');
CREATE TYPE sequence_mode AS ENUM ('standalone', 'imported', 'crm-sync');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'salesperson',
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}',
  PRIMARY KEY (id)
);

-- Create call_logs table
CREATE TABLE public.call_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  lead_id TEXT NOT NULL,
  outcome call_outcome NOT NULL,
  intel TEXT NOT NULL,
  best_talking_point TEXT NOT NULL,
  key_takeaway TEXT NOT NULL,
  call_duration INTEGER,
  sequence_id UUID,
  contact_id TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  attempt_number INTEGER DEFAULT 1,
  additional_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create battle_cards table
CREATE TABLE public.battle_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  lead_data JSONB NOT NULL,
  selected_content JSONB NOT NULL DEFAULT '[]',
  dynamic_intelligence TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create call_sequences table
CREATE TABLE public.call_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  contacts JSONB NOT NULL DEFAULT '[]',
  status sequence_status DEFAULT 'planned',
  sprint_size INTEGER NOT NULL DEFAULT 5,
  mode sequence_mode DEFAULT 'standalone',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sequences ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow user creation during signup" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin users can view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Call logs policies
CREATE POLICY "Users can view own call logs" ON public.call_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call logs" ON public.call_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call logs" ON public.call_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own call logs" ON public.call_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Battle cards policies
CREATE POLICY "Users can view own battle cards" ON public.battle_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own battle cards" ON public.battle_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own battle cards" ON public.battle_cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own battle cards" ON public.battle_cards
  FOR DELETE USING (auth.uid() = user_id);

-- Call sequences policies
CREATE POLICY "Users can view own call sequences" ON public.call_sequences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call sequences" ON public.call_sequences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call sequences" ON public.call_sequences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own call sequences" ON public.call_sequences
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_call_logs_user_id ON public.call_logs(user_id);
CREATE INDEX idx_call_logs_created_at ON public.call_logs(created_at DESC);
CREATE INDEX idx_call_logs_sequence_id ON public.call_logs(sequence_id);
CREATE INDEX idx_battle_cards_user_id ON public.battle_cards(user_id);
CREATE INDEX idx_battle_cards_created_at ON public.battle_cards(created_at DESC);
CREATE INDEX idx_call_sequences_user_id ON public.call_sequences(user_id);
CREATE INDEX idx_call_sequences_status ON public.call_sequences(status);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'salesperson')
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update last_login
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS trigger AS $$
BEGIN
  UPDATE public.users 
  SET last_login = now()
  WHERE id = new.id;
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger to update last_login on auth
CREATE TRIGGER on_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.update_last_login();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.call_logs TO authenticated;
GRANT ALL ON public.battle_cards TO authenticated;
GRANT ALL ON public.call_sequences TO authenticated;