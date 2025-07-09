import { NetlifyDatabaseService } from '@/services/netlifyDb';
import { type UserPreferences } from '@/db/schema';

interface LocalStorageData {
  lockedContacts?: any[];
  wolfDenStorage?: {
    state: {
      callLogs?: any[];
      battleCards?: any[];
      callSequences?: any[];
      profile?: any;
      advancedMode?: boolean;
      salesWizardMode?: boolean;
    };
  };
  currentCompanyIntelligence?: any;
  'wolf-den-theme'?: string;
  searchConfig?: any;
}

/**
 * Migrates data from localStorage to the database
 * This should be run once after user authentication
 */
export async function migrateLocalStorageToDatabase(userId: string): Promise<{
  success: boolean;
  migrated: {
    contacts: number;
    preferences: boolean;
    intelligence: number;
  };
  errors: string[];
}> {
  const errors: string[] = [];
  const migrated = {
    contacts: 0,
    preferences: false,
    intelligence: 0
  };

  try {
    // 1. Get all localStorage data
    const lockedContactsRaw = localStorage.getItem('wolf-den-locked-contacts');
    const wolfDenStorageRaw = localStorage.getItem('wolf-den-storage');
    const companyIntelRaw = localStorage.getItem('currentCompanyIntelligence');
    const themeRaw = localStorage.getItem('wolf-den-theme');
    const searchConfigRaw = localStorage.getItem('searchConfig');

    // 2. Parse localStorage data
    const localData: LocalStorageData = {
      lockedContacts: lockedContactsRaw ? JSON.parse(lockedContactsRaw) : [],
      wolfDenStorage: wolfDenStorageRaw ? JSON.parse(wolfDenStorageRaw) : null,
      currentCompanyIntelligence: companyIntelRaw ? JSON.parse(companyIntelRaw) : null,
      'wolf-den-theme': themeRaw || 'light',
      searchConfig: searchConfigRaw ? JSON.parse(searchConfigRaw) : null
    };

    // 3. Migrate locked contacts
    if (localData.lockedContacts && localData.lockedContacts.length > 0) {
      try {
        const contactsToMigrate = localData.lockedContacts.map((contact: any) => ({
          userId,
          company: contact.companyName || contact.company || 'Unknown Company',
          name: contact.contactName || contact.name || 'Unknown Contact',
          title: contact.title || contact.contactTitle,
          phone: contact.phone || contact.contactPhone,
          email: contact.email || contact.contactEmail,
          linkedinUrl: contact.linkedinUrl || contact.linkedin,
          industry: contact.industry,
          employeeCount: contact.employeeCount,
          revenue: contact.revenue,
          personaType: contact.persona || contact.personaType,
          status: 'new' as const,
          tags: contact.tags || [],
          notes: contact.notes,
          companyIntelligence: contact.intelligence || contact.companyIntelligence
        }));

        const importedContacts = await NetlifyDatabaseService.contactService.bulkCreate(userId, contactsToMigrate);
        migrated.contacts = importedContacts.length;
        
        // Clear localStorage after successful migration
        localStorage.removeItem('wolf-den-locked-contacts');
      } catch (error) {
        errors.push(`Failed to migrate contacts: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // 4. Migrate user preferences
    if (localData.wolfDenStorage?.state || localData['wolf-den-theme'] || localData.searchConfig) {
      try {
        const preferences: Partial<UserPreferences> = {
          theme: (localData['wolf-den-theme'] as 'light' | 'dark') || 'light',
          advancedMode: localData.wolfDenStorage?.state?.advancedMode || false,
          salesWizardMode: localData.wolfDenStorage?.state?.salesWizardMode || true,
          searchConfig: localData.searchConfig || {},
          uiPreferences: {
            profile: localData.wolfDenStorage?.state?.profile
          }
        };

        await NetlifyDatabaseService.userPreferencesService.update(userId, preferences);
        migrated.preferences = true;
        
        // Clear preference-related localStorage
        localStorage.removeItem('wolf-den-theme');
        localStorage.removeItem('searchConfig');
      } catch (error) {
        errors.push(`Failed to migrate preferences: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // 5. Migrate company intelligence
    if (localData.currentCompanyIntelligence) {
      try {
        const intel: any = localData.currentCompanyIntelligence;
        if (intel.companyName || intel.company) {
          await NetlifyDatabaseService.companyIntelligenceService.set({
            companyName: intel.companyName || intel.company,
            industry: intel.industry,
            employeeCount: intel.employeeCount,
            revenue: intel.revenue,
            intelligenceData: intel,
            source: 'localStorage-migration',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          });
          migrated.intelligence = 1;
          
          // Clear intelligence localStorage
          localStorage.removeItem('currentCompanyIntelligence');
        }
      } catch (error) {
        errors.push(`Failed to migrate company intelligence: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // 6. Clean up other localStorage items that are now in database
    // Keep wolf-den-storage for now as it contains session state
    // But remove database-migrated fields
    if (localData.wolfDenStorage) {
      const cleanedStorage = {
        ...localData.wolfDenStorage,
        state: {
          ...localData.wolfDenStorage.state,
          // Remove migrated fields but keep session state
          advancedMode: undefined,
          salesWizardMode: undefined,
          profile: undefined
        }
      };
      localStorage.setItem('wolf-den-storage', JSON.stringify(cleanedStorage));
    }

    return {
      success: errors.length === 0,
      migrated,
      errors
    };
  } catch (error) {
    return {
      success: false,
      migrated,
      errors: [`Migration failed: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
}

/**
 * Check if migration is needed
 */
export function isMigrationNeeded(): boolean {
  const hasLockedContacts = !!localStorage.getItem('wolf-den-locked-contacts');
  const hasCompanyIntel = !!localStorage.getItem('currentCompanyIntelligence');
  const hasTheme = !!localStorage.getItem('wolf-den-theme');
  const hasSearchConfig = !!localStorage.getItem('searchConfig');
  
  return hasLockedContacts || hasCompanyIntel || hasTheme || hasSearchConfig;
}

/**
 * Create a backup of localStorage data before migration
 */
export function backupLocalStorage(): string {
  const backup: Record<string, any> = {};
  const keysToBackup = [
    'wolf-den-locked-contacts',
    'wolf-den-storage',
    'currentCompanyIntelligence',
    'wolf-den-theme',
    'searchConfig'
  ];
  
  keysToBackup.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        backup[key] = JSON.parse(value);
      } catch {
        backup[key] = value;
      }
    }
  });
  
  const backupString = JSON.stringify(backup, null, 2);
  const backupKey = `wolf-den-backup-${Date.now()}`;
  localStorage.setItem(backupKey, backupString);
  
  return backupKey;
}