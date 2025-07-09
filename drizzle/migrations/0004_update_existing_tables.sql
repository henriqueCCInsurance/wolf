-- Update call_logs table
ALTER TABLE call_logs 
  ADD COLUMN IF NOT EXISTS contact_id UUID REFERENCES contacts(id),
  ADD COLUMN IF NOT EXISTS battle_card_id UUID REFERENCES battle_cards(id);

-- Update battle_cards table
ALTER TABLE battle_cards 
  ADD COLUMN IF NOT EXISTS contact_id UUID REFERENCES contacts(id),
  ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- Update call_sequences table
ALTER TABLE call_sequences 
  ADD COLUMN IF NOT EXISTS contact_ids UUID[],
  ADD COLUMN IF NOT EXISTS total_contacts INTEGER,
  ADD COLUMN IF NOT EXISTS contacted_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qualified_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_call_logs_contact_id ON call_logs(contact_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_battle_card_id ON call_logs(battle_card_id);
CREATE INDEX IF NOT EXISTS idx_battle_cards_contact_id ON battle_cards(contact_id);
CREATE INDEX IF NOT EXISTS idx_call_sequences_contact_ids ON call_sequences USING GIN(contact_ids);