export interface Lead {
  companyName: string;
  contactName: string;
  contactPhone?: string;
  contactPosition?: string;
  contactEmail?: string;
  industry: string;
  persona: PersonaType;
}

// Keep Prospect as alias for backward compatibility
export interface Prospect extends Lead {}

export type PersonaType = 
  | 'cost-conscious-employer'
  | 'benefits-optimizer'
  | 'roi-focused-executive'
  | 'gatekeeper'
  | 'strategic-ceo'
  | 'operations-leader'
  | 'culture-champion';

export interface PersonaData {
  id: PersonaType;
  title: string;
  description: string;
  profile: string;
  keyPressures: string[];
  language: string[];
  digitalExpectations: string;
  redFlags: string[];
}

export interface IndustryData {
  id: string;
  name: string;
  emergingRisks: string[];
  connectionToBenefits: string[];
}

export interface ContentItem {
  id: string;
  type: 'opener' | 'thought-leadership' | 'objection-handler';
  persona: PersonaType;
  content: string;
  context?: string;
  source?: string; // Optional for backward compatibility
  dataPoints?: {
    statistic: string;
    value: string;
    source: string;
    year?: string;
  }[];
}

export interface CallLog {
  id: string;
  leadId: string;
  outcome: 'meeting-booked' | 'nurture' | 'disqualified' | 'follow-up';
  intel: string;
  bestTalkingPoint: string;
  keyTakeaway: string;
  createdAt: Date;
  callDuration?: number;
  // New fields for sequence integration
  sequenceId?: string;
  contactId?: string;
  battleCardId?: string;
  callCardId?: string; // Alias for backward compatibility
  startTime?: Date;
  endTime?: Date;
  attemptNumber?: number;
  additionalInfo?: {
    newContacts?: string;
    referrals?: string;
    companyInsights?: string;
    nextSteps?: string;
    meetingType?: string;
    followUpDate?: string;
    address?: string;
  };
  // Competitive intelligence fields
  competitiveEncounter?: {
    competitorMentioned?: string;
    competitorStrengths?: string;
    competitorWeaknesses?: string;
    switchingReasons?: string;
    decisionFactors?: string;
    competitiveResponse?: string;
  };
}

export interface CallCard {
  lead: Lead;
  selectedContent: ContentItem[];
  dynamicIntelligence: string[];
  generatedAt: Date;
}

// Backward compatibility alias
export type BattleCard = CallCard;

export interface WebSearchResult {
  title: string;
  snippet: string;
  url: string;
  relevanceScore: number;
}

// Authentication & User Management Types
export type UserRole = 'salesperson' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  settings?: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  autoSave: boolean;
  defaultCallObjectives: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Call Sequence & Planning Types
export interface CallSequence {
  id: string;
  name: string;
  contacts: Contact[];
  contactIds?: string[];
  totalContacts?: number;
  contactedCount?: number;
  qualifiedCount?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  status: 'planned' | 'active' | 'completed';
  sprintSize: number;
  mode: 'standalone' | 'imported' | 'crm-sync';
}

export interface Contact {
  id: string;
  companyName: string;
  contactName: string;
  email?: string;
  phone?: string;
  position?: string;
  title?: string;
  industry: string;
  persona?: PersonaType;
  address?: string;
  latitude?: number;
  longitude?: number;
  employeeCount?: string;
  revenue?: string;
  notes?: string;
  source: 'manual' | 'csv' | 'crm';
  status: 'pending' | 'called' | 'success' | 'failed' | 'new' | 'contacted' | 'qualified' | 'disqualified' | 'closed';
  callResult?: CallLog;
  score?: number;
  scoreCategory?: 'hot' | 'warm' | 'cool' | 'cold';
  relationships?: ContactRelationship[];
}

// Database Contact type that matches the schema
export interface DatabaseContact {
  id: string;
  userId: string;
  company: string;
  name: string;
  title?: string;
  phone?: string;
  email?: string;
  linkedinUrl?: string;
  industry?: string;
  employeeCount?: string;
  revenue?: string;
  personaType?: string;
  status: 'new' | 'contacted' | 'qualified' | 'disqualified' | 'closed';
  tags?: string[];
  notes?: string;
  companyIntelligence?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Performance & Analytics Types
export interface PerformanceMetrics {
  userId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  totalCalls: number;
  successfulCalls: number;
  meetingsBooked: number;
  avgCallDuration: number;
  successRate: number;
  topPerformingPersona: PersonaType;
  improvementAreas: string[];
}

export interface TeamPerformance {
  teamSize: number;
  totalCalls: number;
  totalMeetings: number;
  avgSuccessRate: number;
  topPerformer: {
    userId: string;
    name: string;
    successRate: number;
  };
  memberPerformance: PerformanceMetrics[];
}

// Export utility types
export type TimePeriod = 'week' | 'month' | 'quarter' | 'year';

export interface ExportableData {
  [key: string]: string | number | boolean | Date | null | undefined;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Web Search API types
export interface SearchApiItem {
  title?: string;
  snippet?: string;
  link?: string;
  displayLink?: string;
}

export interface BingSearchItem {
  name?: string;
  snippet?: string;
  url?: string;
}

export interface SerpApiItem {
  title?: string;
  snippet?: string;
  link?: string;
}

// Activity Feed Types
export type ActivityType = 
  | 'call-made'
  | 'meeting-booked'
  | 'battle-card-created'
  | 'success-celebration'
  | 'lead-qualified'
  | 'sequence-completed'
  | 'milestone-reached';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  data: {
    companyName?: string;
    contactName?: string;
    outcome?: string;
    duration?: number;
    sequenceName?: string;
    milestone?: string;
    celebrationType?: string;
    [key: string]: any;
  };
}

// Relationship Mapping Types
export type RelationshipType = 'reports-to' | 'works-with' | 'influences' | 'peer' | 'dotted-line';
export type RelationshipStrength = 'strong' | 'medium' | 'weak';

export interface ContactRelationship {
  id: string;
  fromContactId: string;
  toContactId: string;
  type: RelationshipType;
  strength: RelationshipStrength;
  notes?: string;
}

export interface RelationshipMapData {
  contacts: Contact[];
  relationships: ContactRelationship[];
  companyName: string;
}

// Success Prediction Types
export interface PredictionFactors {
  personaSuccessRate: number;
  industrySuccessRate: number;
  timeOfDayScore: number;
  dayOfWeekScore: number;
  previousInteractionScore: number;
  overallTrend: 'improving' | 'stable' | 'declining';
}

export interface SuccessPrediction {
  score: number; // 0-100
  confidence: 'high' | 'medium' | 'low';
  factors: PredictionFactors;
  recommendations: string[];
  bestTimeToCall: {
    dayOfWeek: string;
    timeRange: string;
  };
}

// Competitive Intelligence Types
export interface Competitor {
  id: string;
  name: string;
  category: 'national-carrier' | 'regional-carrier' | 'local-broker' | 'peo' | 'other';
  logo?: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  differentiators: string[];
  commonObjections: CompetitiveObjection[];
  marketShare?: number;
  targetMarket: string[];
}

export interface CompetitiveObjection {
  id: string;
  objection: string;
  frequency: 'high' | 'medium' | 'low';
  responses: CompetitiveResponse[];
  context?: string;
}

export interface CompetitiveResponse {
  id: string;
  response: string;
  effectivenessRating: number; // 1-5
  tone: 'collaborative' | 'assertive' | 'consultative' | 'educational';
  talkingPoints: string[];
  followUpQuestions?: string[];
}

export interface CompetitiveEncounter {
  id: string;
  callLogId: string;
  competitorId: string;
  competitorName: string;
  encounteredAt: Date;
  outcome: 'won' | 'lost' | 'ongoing' | 'no-decision';
  objectionsFaced: string[];
  responsesUsed: string[];
  keyFactors: string[];
  intelligence: string;
  lessons: string;
  prospectFeedback?: string;
}

export interface CompetitiveIntelligence {
  id: string;
  competitorId: string;
  source: 'call-feedback' | 'prospect-intel' | 'market-research' | 'other';
  intelligence: string;
  reliability: 'high' | 'medium' | 'low';
  category: 'pricing' | 'service' | 'technology' | 'market-position' | 'other';
  capturedAt: Date;
  prospectContext?: string;
}

export interface CompetitiveAnalytics {
  competitorId: string;
  competitorName: string;
  totalEncounters: number;
  winRate: number;
  lossRate: number;
  commonObjections: Array<{
    objection: string;
    frequency: number;
  }>;
  effectiveResponses: Array<{
    response: string;
    successRate: number;
  }>;
  recentTrends: Array<{
    trend: string;
    timeframe: string;
  }>;
}