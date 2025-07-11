import { z } from 'zod';

// Schema version for migration support
const SCHEMA_VERSION = 1;

// Define schemas for each data type we persist
const CallLogSchema = z.object({
  id: z.string(),
  leadId: z.string(),
  outcome: z.enum(['meeting-booked', 'follow-up', 'left-voicemail', 'no-answer', 'not-interested', 'call-back-later', 'nurture', 'disqualified']),
  notes: z.string().optional(),
  intel: z.string().optional(),
  bestTalkingPoint: z.string().optional(),
  keyTakeaway: z.string().optional(),
  callDuration: z.number().optional(),
  createdAt: z.string(), // ISO date string
  sequenceId: z.string().optional(),
  contactId: z.string().optional(),
  callCardId: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  attemptNumber: z.number().optional(),
  additionalInfo: z.record(z.string(), z.any()).optional()
});

const CallCardSchema = z.object({
  id: z.string(),
  leadId: z.string(),
  createdAt: z.string(),
  content: z.array(z.object({
    id: z.string(),
    type: z.enum(['opener', 'thought-leadership', 'objection-handler', 'intelligence']),
    content: z.string(),
    persona: z.string().optional(),
    category: z.string().optional(),
    source: z.string().optional(),
    dataPoints: z.array(z.string()).optional()
  })),
  dynamicIntel: z.array(z.object({
    title: z.string(),
    snippet: z.string(),
    link: z.string(),
    source: z.string()
  })).optional(),
  leadDetails: z.object({
    companyName: z.string(),
    contactName: z.string(),
    industry: z.string(),
    persona: z.string(),
    companySize: z.string().optional(),
    location: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    linkedIn: z.string().optional()
  })
});

const StorageSchema = z.object({
  version: z.literal(SCHEMA_VERSION),
  callLogs: z.array(CallLogSchema),
  callCards: z.array(CallCardSchema),
  callSequences: z.array(z.any()), // TODO: Define proper schema
  activeSequenceId: z.string().nullable(),
  advancedMode: z.boolean(),
  salesWizardMode: z.boolean(),
  profile: z.record(z.string(), z.any()),
  competitiveEncounters: z.array(z.any()) // TODO: Define proper schema
}).partial();

type StorageData = z.infer<typeof StorageSchema>;

// Define a type that matches what Zustand expects
export interface PersistedState {
  callLogs: any[];
  callCards: any[];
  callSequences: any[];
  activeSequenceId: string | null;
  advancedMode: boolean;
  salesWizardMode: boolean;
  profile: Record<string, any>;
  competitiveEncounters: any[];
}

class LocalStorageService {
  private static instance: LocalStorageService;
  private readonly storageKey = 'wolf-den-storage';
  private readonly maxItemsPerArray = 1000; // Prevent unbounded growth

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  /**
   * Load and validate data from localStorage
   */
  loadState(): PersistedState | null {
    try {
      const rawData = localStorage.getItem(this.storageKey);
      if (!rawData) return null;

      const parsed = JSON.parse(rawData);
      
      // Handle migration if needed
      const migrated = this.migrateData(parsed);
      
      // Validate the data
      const validated = StorageSchema.parse(migrated);
      
      // Apply data cleanup policies
      const cleaned = this.applyRetentionPolicies(validated);
      
      // Convert to the format expected by Zustand
      return {
        callLogs: cleaned.callLogs || [],
        callCards: cleaned.callCards || [],
        callSequences: cleaned.callSequences || [],
        activeSequenceId: cleaned.activeSequenceId || null,
        advancedMode: cleaned.advancedMode || false,
        salesWizardMode: cleaned.salesWizardMode || false,
        profile: cleaned.profile || {},
        competitiveEncounters: cleaned.competitiveEncounters || []
      };
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      
      // Try to recover partial data
      return this.attemptPartialRecovery();
    }
  }

  /**
   * Save validated data to localStorage
   */
  saveState(data: PersistedState): void {
    try {
      // Ensure we have a version
      const dataWithVersion = {
        version: SCHEMA_VERSION,
        ...data
      };

      // Apply retention policies before saving
      const cleaned = this.applyRetentionPolicies(dataWithVersion as StorageData);
      
      // Validate before saving
      const validated = StorageSchema.parse(cleaned);
      
      localStorage.setItem(this.storageKey, JSON.stringify(validated));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
      
      // Attempt to save critical data only
      this.attemptCriticalSave(data);
    }
  }

  /**
   * Clear all persisted data
   */
  clearAll(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Migrate data from older schema versions
   */
  private migrateData(data: any): any {
    // If no version, assume it's version 0 (original format)
    if (!data.version) {
      console.log('Migrating from version 0 to version 1');
      
      // Add version field
      data.version = SCHEMA_VERSION;
      
      // Ensure all required fields exist
      data.callLogs = data.callLogs || [];
      data.callCards = data.callCards || data.battleCards || [];
      delete data.battleCards; // Remove old field name
      
      // Ensure dates are strings
      if (data.callLogs) {
        data.callLogs = data.callLogs.map((log: any) => ({
          ...log,
          createdAt: log.createdAt || new Date().toISOString(),
          startTime: log.startTime ? new Date(log.startTime).toISOString() : undefined,
          endTime: log.endTime ? new Date(log.endTime).toISOString() : undefined
        }));
      }
      
      if (data.callCards) {
        data.callCards = data.callCards.map((card: any) => ({
          ...card,
          createdAt: card.createdAt || new Date().toISOString()
        }));
      }
    }
    
    return data;
  }

  /**
   * Apply retention policies to prevent unbounded growth
   */
  private applyRetentionPolicies(data: StorageData): StorageData {
    const cleaned = { ...data };
    
    // Keep only the most recent items
    if (cleaned.callLogs && cleaned.callLogs.length > this.maxItemsPerArray) {
      // Sort by createdAt descending and keep most recent
      cleaned.callLogs = cleaned.callLogs
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, this.maxItemsPerArray);
    }
    
    if (cleaned.callCards && cleaned.callCards.length > this.maxItemsPerArray) {
      cleaned.callCards = cleaned.callCards
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, this.maxItemsPerArray);
    }
    
    // Remove old competitive encounters (older than 90 days)
    if (cleaned.competitiveEncounters) {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      cleaned.competitiveEncounters = cleaned.competitiveEncounters.filter((encounter: any) => {
        const encounterDate = new Date(encounter.encounteredAt || encounter.createdAt);
        return encounterDate > ninetyDaysAgo;
      });
    }
    
    return cleaned;
  }

  /**
   * Attempt to recover partial data if full validation fails
   */
  private attemptPartialRecovery(): PersistedState | null {
    try {
      const rawData = localStorage.getItem(this.storageKey);
      if (!rawData) return null;

      const parsed = JSON.parse(rawData);
      const recovered: Partial<StorageData> = {
        version: SCHEMA_VERSION
      };
      
      // Try to recover each field individually
      try {
        recovered.callLogs = z.array(CallLogSchema).parse(parsed.callLogs || []);
      } catch {
        recovered.callLogs = [];
      }
      
      try {
        recovered.callCards = z.array(CallCardSchema).parse(parsed.callCards || parsed.battleCards || []);
      } catch {
        recovered.callCards = [];
      }
      
      // Recover simple fields
      recovered.advancedMode = typeof parsed.advancedMode === 'boolean' ? parsed.advancedMode : false;
      recovered.salesWizardMode = typeof parsed.salesWizardMode === 'boolean' ? parsed.salesWizardMode : false;
      recovered.profile = parsed.profile || {};
      
      console.warn('Partial data recovery completed');
      
      // Return in the expected format
      return {
        callLogs: recovered.callLogs || [],
        callCards: recovered.callCards || [],
        callSequences: [],
        activeSequenceId: null,
        advancedMode: recovered.advancedMode || false,
        salesWizardMode: recovered.salesWizardMode || false,
        profile: recovered.profile || {},
        competitiveEncounters: []
      };
    } catch {
      return null;
    }
  }

  /**
   * Attempt to save only critical data if full save fails
   */
  private attemptCriticalSave(data: PersistedState): void {
    try {
      const critical = {
        version: SCHEMA_VERSION,
        callLogs: data.callLogs || [],
        callCards: data.callCards || []
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(critical));
      console.warn('Critical data saved successfully');
    } catch (error) {
      console.error('Failed to save even critical data:', error);
    }
  }

  /**
   * Get storage size info for monitoring
   */
  getStorageInfo(): {
    sizeInBytes: number;
    sizeInKB: number;
    itemCounts: Record<string, number>;
  } {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return { sizeInBytes: 0, sizeInKB: 0, itemCounts: {} };
      
      const sizeInBytes = new Blob([data]).size;
      const parsed = JSON.parse(data);
      
      return {
        sizeInBytes,
        sizeInKB: Math.round(sizeInBytes / 1024),
        itemCounts: {
          callLogs: parsed.callLogs?.length || 0,
          callCards: parsed.callCards?.length || 0,
          callSequences: parsed.callSequences?.length || 0,
          competitiveEncounters: parsed.competitiveEncounters?.length || 0
        }
      };
    } catch {
      return { sizeInBytes: 0, sizeInKB: 0, itemCounts: {} };
    }
  }
}

export const localStorageService = LocalStorageService.getInstance();