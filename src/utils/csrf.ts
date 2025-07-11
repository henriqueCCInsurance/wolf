/**
 * CSRF Protection utility
 * Generates and validates CSRF tokens for state-changing operations
 */

// Generate a cryptographically secure random token
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Store CSRF token in session storage
export const storeCSRFToken = (token: string): void => {
  sessionStorage.setItem('wolf-den-csrf-token', token);
};

// Get stored CSRF token
export const getCSRFToken = (): string | null => {
  let token = sessionStorage.getItem('wolf-den-csrf-token');
  
  // Generate new token if none exists
  if (!token) {
    token = generateCSRFToken();
    storeCSRFToken(token);
  }
  
  return token;
};

// Validate CSRF token
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  return storedToken !== null && storedToken === token;
};

// Add CSRF token to request headers
export const addCSRFHeader = (headers: Headers | Record<string, string> = {}): Headers => {
  const token = getCSRFToken();
  const newHeaders = headers instanceof Headers ? headers : new Headers(headers);
  
  if (token) {
    newHeaders.set('X-CSRF-Token', token);
  }
  
  return newHeaders;
};

// Middleware for API requests
export const csrfFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const { headers = {}, ...otherOptions } = options;
  
  // Only add CSRF for state-changing methods
  const method = otherOptions.method?.toUpperCase() || 'GET';
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const newHeaders = addCSRFHeader(headers as Headers | Record<string, string>);
    
    return fetch(url, {
      ...otherOptions,
      headers: newHeaders,
      credentials: 'same-origin' // Important for CSRF protection
    });
  }
  
  // For GET requests, just pass through
  return fetch(url, options);
};

// Hook for React components
export const useCSRFToken = () => {
  const token = getCSRFToken();
  
  return {
    token,
    headers: { 'X-CSRF-Token': token || '' }
  };
};