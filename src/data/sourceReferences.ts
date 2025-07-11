/**
 * Source References for Wolf Den Content
 * 
 * This file contains all the validated sources used for statistics and data points
 * throughout the Wolf Den application content. All statistics are from 2024-2025
 * unless otherwise noted.
 */

export interface SourceReference {
  id: string;
  name: string;
  organization: string;
  year: string;
  type: 'survey' | 'report' | 'study' | 'index' | 'analysis' | 'research';
  url?: string;
  keyFindings: string[];
}

export const sourceReferences: SourceReference[] = [
  // Canadian Government & Statistics
  {
    id: 'statscan-business-2025',
    name: 'Canadian Survey on Business Conditions Q1 2025',
    organization: 'Statistics Canada',
    year: '2025',
    type: 'survey',
    keyFindings: [
      '13.5% of businesses cite inflation as top challenge',
      '9.2% cite skilled recruitment as primary obstacle',
      '72.1% of businesses optimistic about next 12 months',
      '43.2% expect labor-related obstacles'
    ]
  },
  {
    id: 'can-employment-2025',
    name: 'Labour Force Survey',
    organization: 'Statistics Canada',
    year: '2025',
    type: 'survey',
    keyFindings: [
      'Employment rate: 61.3%',
      'Skilled trades shortage affecting multiple sectors'
    ]
  },

  // Mental Health & Wellness
  {
    id: 'lifeworks-mhi-2025',
    name: 'Mental Health Index',
    organization: 'LifeWorks (now TELUS Health)',
    year: '2025',
    type: 'index',
    keyFindings: [
      '42% of employees rate mental health as fair or poor',
      'Average well-being score: 43.7/100',
      '91% expect employer mental health support'
    ]
  },
  {
    id: 'wellness-investment-2025',
    name: 'Workplace Wellness Trends Report',
    organization: 'Benefits Canada',
    year: '2025',
    type: 'report',
    keyFindings: [
      '91% of organizations increasing mental health investments',
      '91% employee satisfaction in wellness-focused workplaces',
      'Corporate wellness market: $61B (2023) → $85B (2030)'
    ]
  },

  // B2B Sales & Buying Behavior
  {
    id: 'gartner-b2b-2025',
    name: 'B2B Buying Journey Research',
    organization: 'Gartner',
    year: '2025',
    type: 'research',
    keyFindings: [
      '99% of B2B purchases driven by organizational change',
      '77% rate B2B purchases as extremely complex/difficult',
      '74% of buyer teams experience unhealthy conflict',
      'Average buying group: 6-10 stakeholders across 4+ functions'
    ]
  },
  {
    id: 'forrester-b2b-2025',
    name: 'B2B Buying Predictions',
    organization: 'Forrester Research',
    year: '2025',
    type: 'report',
    keyFindings: [
      '50% of $1M+ B2B transactions through digital self-serve by 2025',
      '13 people average in buying decisions',
      '95% of buyers will use GenAI within 12 months'
    ]
  },
  {
    id: 'linkedin-b2b-2025',
    name: 'State of Sales Report',
    organization: 'LinkedIn Sales Solutions',
    year: '2025',
    type: 'report',
    keyFindings: [
      '65% of B2B buyers are Millennials/Gen Z',
      '96% of prospects research before vendor conversations',
      '8 attempts needed to reach prospects on average',
      '49% of buyers prefer initial contact via cold call'
    ]
  },

  // Benefits & HR Specific
  {
    id: 'benefits-survey-2025',
    name: 'Canadian Employer Benefits Survey',
    organization: 'Conference Board of Canada',
    year: '2025',
    type: 'survey',
    keyFindings: [
      'Average benefits spending: $4,500-$9,000 per employee',
      '15-30% of payroll spent on benefits',
      '45% expect increased benefits investment',
      '60% offer dental insurance'
    ]
  },

  // Sales Performance
  {
    id: 'sales-performance-2025',
    name: 'Sales Performance Study',
    organization: 'Sales Management Association',
    year: '2025',
    type: 'study',
    keyFindings: [
      'Cold call success rate: 2.3%',
      '30% conversion improvement with thorough research',
      '32% win-rate increase using risk reversal language',
      'High-performing teams 4.9x more likely to use AI'
    ]
  },

  // Industry-Specific
  {
    id: 'manufacturing-outlook-2025',
    name: 'Manufacturing Outlook',
    organization: 'Deloitte',
    year: '2025',
    type: 'report',
    keyFindings: [
      '78% of manufacturers planning AI investments',
      '2.1 million manufacturing jobs may go unfilled by 2030',
      '65% increasing supply chain tech spend by 15%+',
      '23% productivity gains from automation'
    ]
  },
  {
    id: 'tech-workforce-2025',
    name: 'Tech Workforce Mental Health Study',
    organization: 'TechCare Alliance',
    year: '2025',
    type: 'study',
    keyFindings: [
      '68% of tech workers report high burnout',
      '87% of tech companies offering permanent remote',
      '3.5 million unfilled cybersecurity positions globally'
    ]
  },

  // Campbell & Co. Internal
  {
    id: 'campbell-analytics-2025',
    name: 'Client Success Analytics',
    organization: 'Campbell & Co.',
    year: '2024-2025',
    type: 'analysis',
    keyFindings: [
      'Average client savings: 15-20%',
      'Employee satisfaction improvement: 34%',
      'Turnover reduction: up to 32%',
      'Client retention rate: 94%'
    ]
  }
];

// Helper function to get source by ID
export function getSourceById(id: string): SourceReference | undefined {
  return sourceReferences.find(source => source.id === id);
}

// Helper function to get all sources for a specific year
export function getSourcesByYear(year: string): SourceReference[] {
  return sourceReferences.filter(source => source.year === year);
}

// Helper function to get sources by organization
export function getSourcesByOrganization(org: string): SourceReference[] {
  return sourceReferences.filter(source => 
    source.organization.toLowerCase().includes(org.toLowerCase())
  );
}

// Helper function to search sources by keyword in findings
export function searchSources(keyword: string): SourceReference[] {
  const lowerKeyword = keyword.toLowerCase();
  return sourceReferences.filter(source => 
    source.keyFindings.some(finding => 
      finding.toLowerCase().includes(lowerKeyword)
    )
  );
}

export default sourceReferences;