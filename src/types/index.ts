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
  | 'gatekeeper';

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
  };
}

export interface BattleCard {
  lead: Lead;
  selectedContent: ContentItem[];
  dynamicIntelligence: string[];
  generatedAt: Date;
}

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
  createdBy: string;
  createdAt: Date;
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
  industry: string;
  persona?: PersonaType;
  address?: string;
  latitude?: number;
  longitude?: number;
  source: 'manual' | 'csv' | 'crm';
  status: 'pending' | 'called' | 'success' | 'failed';
  callResult?: CallLog;
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