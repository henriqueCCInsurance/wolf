/**
 * Input sanitization utilities for XSS prevention
 * Sanitizes user inputs before rendering or storing
 */

// HTML entities that need escaping
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

// Escape HTML special characters
export const escapeHtml = (text: string): string => {
  return text.replace(/[&<>"'\/]/g, (match) => htmlEntities[match] || match);
};

// Sanitize text input (removes HTML tags and escapes special characters)
export const sanitizeTextInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove any HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  
  // Escape remaining special characters
  return escapeHtml(withoutTags).trim();
};

// Sanitize email input
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  
  // Basic email validation and sanitization
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(trimmed)) {
    return '';
  }
  
  return escapeHtml(trimmed);
};

// Sanitize phone number
export const sanitizePhoneNumber = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return '';
  
  // Remove non-numeric characters except +, -, (, ), and spaces
  return phone.replace(/[^0-9+\-() ]/g, '').trim();
};

// Sanitize company/name inputs (allows letters, numbers, spaces, and common business characters)
export const sanitizeName = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  
  // Allow letters, numbers, spaces, and common business punctuation
  const cleaned = name.replace(/[^a-zA-Z0-9\s\-.,&'()]/g, '');
  return escapeHtml(cleaned).trim();
};

// Sanitize multiline text (for notes, descriptions, etc.)
export const sanitizeMultilineText = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  // Preserve line breaks but escape HTML
  return text
    .split('\n')
    .map(line => escapeHtml(line.trim()))
    .join('\n')
    .trim();
};

// Sanitize URL
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '';
    }
    return escapeHtml(urlObj.toString());
  } catch {
    // If not a valid URL, return empty string
    return '';
  }
};

// Sanitize form data object
export const sanitizeFormData = <T extends Record<string, any>>(
  formData: T,
  fieldTypes: Partial<Record<keyof T, 'text' | 'email' | 'phone' | 'name' | 'multiline' | 'url'>>
): T => {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(formData)) {
    const fieldType = fieldTypes[key as keyof T] || 'text';
    
    if (typeof value === 'string') {
      switch (fieldType) {
        case 'email':
          sanitized[key as keyof T] = sanitizeEmail(value) as any;
          break;
        case 'phone':
          sanitized[key as keyof T] = sanitizePhoneNumber(value) as any;
          break;
        case 'name':
          sanitized[key as keyof T] = sanitizeName(value) as any;
          break;
        case 'multiline':
          sanitized[key as keyof T] = sanitizeMultilineText(value) as any;
          break;
        case 'url':
          sanitized[key as keyof T] = sanitizeUrl(value) as any;
          break;
        default:
          sanitized[key as keyof T] = sanitizeTextInput(value) as any;
      }
    } else {
      // For non-string values, pass through as-is
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
};

// React hook for form sanitization
export const useSanitizedForm = <T extends Record<string, any>>(
  _initialData: T,
  fieldTypes: Partial<Record<keyof T, 'text' | 'email' | 'phone' | 'name' | 'multiline' | 'url'>>
) => {
  const sanitizeField = (fieldName: keyof T, value: string): string => {
    const fieldType = fieldTypes[fieldName] || 'text';
    
    switch (fieldType) {
      case 'email':
        return sanitizeEmail(value);
      case 'phone':
        return sanitizePhoneNumber(value);
      case 'name':
        return sanitizeName(value);
      case 'multiline':
        return sanitizeMultilineText(value);
      case 'url':
        return sanitizeUrl(value);
      default:
        return sanitizeTextInput(value);
    }
  };
  
  const sanitizeAll = (data: T): T => {
    return sanitizeFormData(data, fieldTypes);
  };
  
  return { sanitizeField, sanitizeAll };
};