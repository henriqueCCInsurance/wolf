/**
 * Input validation and sanitization utilities
 * Prevents XSS, SQL injection, and other security vulnerabilities
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Remove any HTML tags and scripts
  const cleaned = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
  
  // Additional sanitization for common XSS patterns
  return cleaned
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize HTML content (for rich text fields)
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover']
  });
}

/**
 * Validate and sanitize email addresses
 */
export function validateEmail(email: string): { isValid: boolean; sanitized: string } {
  const sanitized = sanitizeInput(email).toLowerCase();
  
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return {
    isValid: emailRegex.test(sanitized) && sanitized.length <= 254,
    sanitized
  };
}

/**
 * Validate and sanitize phone numbers
 */
export function validatePhone(phone: string): { isValid: boolean; sanitized: string } {
  // Remove all non-numeric characters except + for international
  const sanitized = phone.replace(/[^\d+]/g, '');
  
  // Check if it's a valid phone number (7-15 digits, optional + at start)
  const isValid = /^\+?\d{7,15}$/.test(sanitized);
  
  return { isValid, sanitized };
}

/**
 * Validate and sanitize URLs
 */
export function validateURL(url: string): { isValid: boolean; sanitized: string } {
  const sanitized = sanitizeInput(url);
  
  try {
    const urlObj = new URL(sanitized);
    // Only allow http and https protocols
    const isValid = ['http:', 'https:'].includes(urlObj.protocol);
    return { isValid, sanitized: isValid ? urlObj.href : '' };
  } catch {
    return { isValid: false, sanitized: '' };
  }
}

/**
 * Validate company/contact names
 */
export function validateName(name: string, minLength: number = 2, maxLength: number = 100): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeInput(name);
  
  if (sanitized.length < minLength) {
    return { 
      isValid: false, 
      sanitized, 
      error: `Name must be at least ${minLength} characters` 
    };
  }
  
  if (sanitized.length > maxLength) {
    return { 
      isValid: false, 
      sanitized: sanitized.substring(0, maxLength), 
      error: `Name must not exceed ${maxLength} characters` 
    };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /[<>{}]/,  // HTML-like characters
    /\$\{/,     // Template injection
    /\{\{/,     // Template injection
    /%\d+/,     // URL encoding
    /\\x[0-9a-f]{2}/i, // Hex encoding
    /\\u[0-9a-f]{4}/i  // Unicode encoding
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      return { 
        isValid: false, 
        sanitized: sanitized.replace(pattern, ''), 
        error: 'Name contains invalid characters' 
      };
    }
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate numeric input
 */
export function validateNumber(
  value: string, 
  min?: number, 
  max?: number, 
  allowDecimals: boolean = false
): { isValid: boolean; sanitized: number | null; error?: string } {
  const sanitized = value.replace(/[^\d.-]/g, '');
  
  const num = allowDecimals ? parseFloat(sanitized) : parseInt(sanitized, 10);
  
  if (isNaN(num)) {
    return { isValid: false, sanitized: null, error: 'Invalid number' };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, sanitized: num, error: `Value must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, sanitized: num, error: `Value must not exceed ${max}` };
  }
  
  return { isValid: true, sanitized: num };
}

/**
 * Validate date input
 */
export function validateDate(date: string): { isValid: boolean; sanitized: Date | null } {
  const sanitized = sanitizeInput(date);
  const parsed = new Date(sanitized);
  
  const isValid = !isNaN(parsed.getTime());
  
  return { isValid, sanitized: isValid ? parsed : null };
}

/**
 * Validate file uploads
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeMB: number = 10
): { isValid: boolean; error?: string } {
  // Check file type
  const fileType = file.type.toLowerCase();
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  
  const isTypeAllowed = allowedTypes.some(type => 
    fileType.includes(type) || fileExtension === type
  );
  
  if (!isTypeAllowed) {
    return { 
      isValid: false, 
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      isValid: false, 
      error: `File size must not exceed ${maxSizeMB}MB` 
    };
  }
  
  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.\./,        // Directory traversal
    /[<>:"|?*]/,   // Invalid characters
    /\0/,          // Null bytes
    /^\./, // Hidden files
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return { 
        isValid: false, 
        error: 'File name contains invalid characters' 
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Sanitize JSON data
 */
export function sanitizeJSON(data: any): any {
  if (typeof data === 'string') {
    return sanitizeInput(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeJSON(item));
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Sanitize the key as well
      const sanitizedKey = sanitizeInput(key);
      sanitized[sanitizedKey] = sanitizeJSON(value);
    }
    return sanitized;
  }
  
  return data;
}

/**
 * Validate API response data
 */
export function validateAPIResponse(data: any, schema: {
  [key: string]: 'string' | 'number' | 'boolean' | 'object' | 'array'
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const [key, expectedType] of Object.entries(schema)) {
    if (!(key in data)) {
      errors.push(`Missing required field: ${key}`);
      continue;
    }
    
    const actualType = Array.isArray(data[key]) ? 'array' : typeof data[key];
    
    if (actualType !== expectedType) {
      errors.push(`Invalid type for ${key}: expected ${expectedType}, got ${actualType}`);
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Create a rate limiter for input validation
 */
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const record = requests.get(identifier);
    
    if (!record || now > record.resetTime) {
      requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (record.count >= maxRequests) {
      return false;
    }
    
    record.count++;
    return true;
  };
}

/**
 * Escape HTML entities
 */
export function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Validate and sanitize CSV data
 */
export function validateCSVData(data: string[][], maxRows: number = 10000): { 
  isValid: boolean; 
  sanitized: string[][]; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  if (data.length > maxRows) {
    errors.push(`CSV has too many rows. Maximum allowed: ${maxRows}`);
    return { isValid: false, sanitized: [], errors };
  }
  
  const sanitized = data.map((row, rowIndex) => 
    row.map((cell, colIndex) => {
      const cleaned = sanitizeInput(cell);
      
      // Check for formula injection
      if (/^[=+\-@]/.test(cell)) {
        errors.push(`Potential formula injection at row ${rowIndex + 1}, column ${colIndex + 1}`);
        return `'${cleaned}`; // Prefix with single quote to prevent formula execution
      }
      
      return cleaned;
    })
  );
  
  return { 
    isValid: errors.length === 0, 
    sanitized, 
    errors 
  };
}