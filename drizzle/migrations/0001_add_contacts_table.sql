-- Create contact status enum
CREATE TYPE contact_status AS ENUM ('new', 'contacted', 'qualified', 'disqualified', 'closed');

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  phone TEXT,
  email TEXT,
  linkedin_url TEXT,
  industry TEXT,
  employee_count TEXT,
  revenue TEXT,
  persona_type TEXT,
  status contact_status DEFAULT 'new' NOT NULL,
  tags TEXT[],
  notes TEXT,
  company_intelligence JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, company, name)
);

-- Create indexes for better query performance
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_company ON contacts(company);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_persona_type ON contacts(persona_type);