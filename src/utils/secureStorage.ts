import { encryptData, decryptData, getStorageEncryptionKey } from './crypto';

/**
 * Secure localStorage wrapper that encrypts/decrypts data
 */
export class SecureStorage {
  private static encryptionKey: CryptoKey | null = null;
  
  /**
   * Initialize the secure storage with encryption key
   */
  static async init(): Promise<void> {
    if (!this.encryptionKey) {
      this.encryptionKey = await getStorageEncryptionKey();
    }
  }
  
  /**
   * Store encrypted data in localStorage
   */
  static async setItem(key: string, value: any): Promise<void> {
    await this.init();
    
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }
    
    const jsonValue = JSON.stringify(value);
    const encryptedValue = await encryptData(jsonValue, this.encryptionKey);
    
    localStorage.setItem(`encrypted_${key}`, encryptedValue);
  }
  
  /**
   * Retrieve and decrypt data from localStorage
   */
  static async getItem<T>(key: string): Promise<T | null> {
    await this.init();
    
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }
    
    const encryptedValue = localStorage.getItem(`encrypted_${key}`);
    if (!encryptedValue) {
      // Check for legacy unencrypted data
      const legacyValue = localStorage.getItem(key);
      if (legacyValue) {
        try {
          // Migrate to encrypted storage
          const parsed = JSON.parse(legacyValue);
          await this.setItem(key, parsed);
          localStorage.removeItem(key); // Remove unencrypted version
          return parsed;
        } catch (e) {
          console.error('Failed to migrate legacy data:', e);
        }
      }
      return null;
    }
    
    try {
      const decryptedValue = await decryptData(encryptedValue, this.encryptionKey);
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  }
  
  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): void {
    localStorage.removeItem(`encrypted_${key}`);
    // Also remove legacy unencrypted version if exists
    localStorage.removeItem(key);
  }
  
  /**
   * Clear all encrypted items from localStorage
   */
  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('encrypted_')) {
        localStorage.removeItem(key);
      }
    });
  }
  
  /**
   * Get all keys (both encrypted and legacy)
   */
  static getAllKeys(): string[] {
    const keys = Object.keys(localStorage);
    const uniqueKeys = new Set<string>();
    
    keys.forEach(key => {
      if (key.startsWith('encrypted_')) {
        uniqueKeys.add(key.substring('encrypted_'.length));
      } else if (!key.includes('wolf-den-keys')) { // Exclude IndexedDB key storage
        uniqueKeys.add(key);
      }
    });
    
    return Array.from(uniqueKeys);
  }
}

/**
 * Migrate existing localStorage data to encrypted storage
 */
export async function migrateToSecureStorage(): Promise<void> {
  const keysToMigrate = [
    'wolf-den-storage', // Zustand store
    'wolf-den-users',   // User credentials
    'wolf-den-user',    // Current user (should be removed)
  ];
  
  for (const key of keysToMigrate) {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        const parsed = JSON.parse(value);
        await SecureStorage.setItem(key, parsed);
        localStorage.removeItem(key);
        console.log(`Migrated ${key} to secure storage`);
      } catch (error) {
        console.error(`Failed to migrate ${key}:`, error);
      }
    }
  }
  
  // Remove sensitive data that should only be in sessionStorage
  localStorage.removeItem('wolf-den-user');
}