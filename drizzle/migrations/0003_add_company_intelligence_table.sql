-- Create company intelligence cache table
CREATE TABLE IF NOT EXISTS company_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL UNIQUE,
  industry TEXT,
  employee_count TEXT,
  revenue TEXT,
  intelligence_data JSONB,
  source TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_company_intelligence_company_name ON company_intelligence(company_name);
CREATE INDEX idx_company_intelligence_expires_at ON company_intelligence(expires_at);