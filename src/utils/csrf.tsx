import { getCSRFToken } from './crypto';

/**
 * CSRF Protection utilities
 */

/**
 * Add CSRF token to request headers
 */
export function addCSRFHeader(headers: HeadersInit = {}): HeadersInit {
  const token = getCSRFToken();
  
  if (!token) {
    console.warn('No CSRF token available');
    return headers;
  }
  
  return {
    ...headers,
    'X-CSRF-Token': token
  };
}

/**
 * Create a fetch wrapper with CSRF protection
 */
export async function secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Only add CSRF token for state-changing methods
  const method = options.method?.toUpperCase() || 'GET';
  const requiresCSRF = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
  
  if (requiresCSRF) {
    options.headers = addCSRFHeader(options.headers);
  }
  
  // Add security headers
  options.headers = {
    ...options.headers,
    'X-Requested-With': 'XMLHttpRequest', // Helps prevent CSRF
  };
  
  // Set credentials to include cookies
  options.credentials = options.credentials || 'same-origin';
  
  const response = await fetch(url, options);
  
  // Check for CSRF token expiration
  if (response.status === 403 && response.headers.get('X-CSRF-Error') === 'token-expired') {
    // Token expired, refresh and retry
    console.log('CSRF token expired, refreshing...');
    window.location.reload(); // Simple approach - reload to get new token
  }
  
  return response;
}

/**
 * Create an axios-like instance with CSRF protection
 */
export const secureAPI = {
  async get(url: string, config?: RequestInit) {
    return secureFetch(url, { ...config, method: 'GET' });
  },
  
  async post(url: string, data?: any, config?: RequestInit) {
    return secureFetch(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      }
    });
  },
  
  async put(url: string, data?: any, config?: RequestInit) {
    return secureFetch(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      }
    });
  },
  
  async delete(url: string, config?: RequestInit) {
    return secureFetch(url, { ...config, method: 'DELETE' });
  },
  
  async patch(url: string, data?: any, config?: RequestInit) {
    return secureFetch(url, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      }
    });
  }
};

/**
 * Hook to get CSRF token for forms
 */
export function useCSRFToken(): string | null {
  return getCSRFToken();
}

/**
 * Component to include CSRF token in forms
 */
export function CSRFTokenInput(): JSX.Element | null {
  const token = getCSRFToken();
  
  if (!token) return null;
  
  return (
    <input 
      type="hidden" 
      name="_csrf" 
      value={token}
    />
  );
}