-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  advanced_mode BOOLEAN DEFAULT false,
  sales_wizard_mode BOOLEAN DEFAULT true,
  default_persona TEXT,
  search_config JSONB,
  ui_preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create index for user_id lookup
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);