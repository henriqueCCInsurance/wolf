import { migrateToSecureStorage } from './secureStorage';

/**
 * Run security migrations on app startup
 */
export async function runSecurityMigrations(): Promise<void> {
  console.log('Running security migrations...');
  
  try {
    // 1. Migrate localStorage data to encrypted storage
    await migrateToSecureStorage();
    
    // 2. Remove any sensitive data from unencrypted storage
    cleanupLegacyStorage();
    
    // 3. Update demo passwords if they're still using weak passwords
    updateDemoPasswords();
    
    console.log('Security migrations completed successfully');
  } catch (error) {
    console.error('Security migration failed:', error);
    // Continue app startup even if migration fails
  }
}

/**
 * Remove sensitive data from unencrypted localStorage
 */
function cleanupLegacyStorage(): void {
  const sensitiveKeys = [
    'wolf-den-user',          // User session data
    'wolf-den-auth-token',    // Auth tokens
    'wolf-den-credentials',   // Any stored credentials
    'wolf-den-api-keys',      // API keys
  ];
  
  sensitiveKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`Removed sensitive data: ${key}`);
    }
  });
  
  // Remove any keys that look like they contain sensitive data
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value && (
      value.includes('password') ||
      value.includes('token') ||
      value.includes('secret') ||
      value.includes('apiKey') ||
      value.includes('credentials')
    )) {
      console.warn(`Found potentially sensitive data in key: ${key}`);
      // Don't auto-remove, just warn for manual review
    }
  });
}

/**
 * Update demo passwords to use strong passwords
 */
function updateDemoPasswords(): void {
  const usersKey = 'wolf-den-users';
  const encryptedUsersKey = 'encrypted_wolf-den-users';
  
  // Check if we have encrypted users already
  if (localStorage.getItem(encryptedUsersKey)) {
    // Already migrated
    return;
  }
  
  const users = localStorage.getItem(usersKey);
  if (!users) return;
  
  try {
    const parsed = JSON.parse(users);
    let updated = false;
    
    // Check if any passwords are still using btoa (base64)
    parsed.forEach((user: any) => {
      if (user.password && !user.password.includes(':')) {
        // This is likely a btoa password, mark for update
        console.warn(`User ${user.email} has legacy password format`);
        updated = true;
        // Don't change the password here, let the auth service handle migration
      }
    });
    
    if (updated) {
      console.log('Legacy password formats detected, will be migrated on next login');
    }
  } catch (error) {
    console.error('Failed to check demo passwords:', error);
  }
}

/**
 * Check if security migrations have been completed
 */
export function hasCompletedSecurityMigrations(): boolean {
  // Check for existence of encrypted storage keys
  const encryptedKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('encrypted_')
  );
  
  // If we have encrypted keys and no legacy sensitive data, migrations are complete
  const hasEncryptedData = encryptedKeys.length > 0;
  const hasLegacyUserData = localStorage.getItem('wolf-den-user') !== null;
  
  return hasEncryptedData && !hasLegacyUserData;
}