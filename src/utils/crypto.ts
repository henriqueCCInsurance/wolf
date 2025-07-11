// Cryptographic utilities for secure password hashing and data encryption

/**
 * Hash a password using Web Crypto API
 * Note: In production, use bcrypt or argon2 on the server side
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Convert password to Uint8Array
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  
  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  // Derive key using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  // Convert to base64 for storage
  const hashArray = new Uint8Array(derivedBits);
  const hashBase64 = btoa(String.fromCharCode(...hashArray));
  const saltBase64 = btoa(String.fromCharCode(...salt));
  
  // Return salt and hash combined
  return `${saltBase64}:${hashBase64}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [saltBase64, hashBase64] = storedHash.split(':');
    
    // Decode salt
    const salt = new Uint8Array(
      atob(saltBase64).split('').map(char => char.charCodeAt(0))
    );
    
    // Hash the provided password with the same salt
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    // Convert to base64 and compare
    const hashArray = new Uint8Array(derivedBits);
    const newHashBase64 = btoa(String.fromCharCode(...hashArray));
    
    return newHashBase64 === hashBase64;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Encrypt data for localStorage using Web Crypto API
 */
export async function encryptData(data: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  
  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the data
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encodedData
  );
  
  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  
  // Convert to base64 for storage
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt data from localStorage
 */
export async function decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
  // Decode from base64
  const combined = new Uint8Array(
    atob(encryptedData).split('').map(char => char.charCodeAt(0))
  );
  
  // Extract IV and encrypted data
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  // Decrypt
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    data
  );
  
  // Convert back to string
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

/**
 * Generate or retrieve encryption key for localStorage
 */
export async function getStorageEncryptionKey(): Promise<CryptoKey> {
  const keyName = 'wolf-den-storage-key';
  
  // Check if key exists in IndexedDB
  const existingKey = await getKeyFromIndexedDB(keyName);
  if (existingKey) {
    return existingKey;
  }
  
  // Generate new key
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
  
  // Store in IndexedDB
  await storeKeyInIndexedDB(keyName, key);
  
  return key;
}

/**
 * Store CryptoKey in IndexedDB
 */
async function storeKeyInIndexedDB(name: string, key: CryptoKey): Promise<void> {
  const db = await openKeyDatabase();
  const transaction = db.transaction(['keys'], 'readwrite');
  const store = transaction.objectStore('keys');
  
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  store.put({ name, key: exportedKey });
}

/**
 * Retrieve CryptoKey from IndexedDB
 */
async function getKeyFromIndexedDB(name: string): Promise<CryptoKey | null> {
  try {
    const db = await openKeyDatabase();
    const transaction = db.transaction(['keys'], 'readonly');
    const store = transaction.objectStore('keys');
    
    const result = await new Promise<any>((resolve) => {
      const request = store.get(name);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
    
    if (!result) return null;
    
    return crypto.subtle.importKey(
      'raw',
      result.key,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    console.error('Error retrieving key from IndexedDB:', error);
    return null;
  }
}

/**
 * Open IndexedDB for key storage
 */
async function openKeyDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('wolf-den-keys', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('keys')) {
        db.createObjectStore('keys', { keyPath: 'name' });
      }
    };
  });
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common patterns
  const commonPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^admin/i,
    /^letmein/i,
    /^welcome/i,
    /^monkey/i,
    /^dragon/i
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password contains common patterns and is too weak');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return generateSecureToken(32);
}

/**
 * Store CSRF token securely
 */
export function storeCSRFToken(token: string): void {
  // Store in sessionStorage (not localStorage) for CSRF tokens
  sessionStorage.setItem('wolf-den-csrf-token', token);
}

/**
 * Get CSRF token
 */
export function getCSRFToken(): string | null {
  return sessionStorage.getItem('wolf-den-csrf-token');
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  const storedToken = getCSRFToken();
  return storedToken !== null && storedToken === token;
}