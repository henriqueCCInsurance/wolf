/**
 * Security Headers Configuration
 * These should be set by your server or CDN, but we provide configuration here
 */

export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net", // Allow CDN scripts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Allow inline styles and Google Fonts
    "font-src 'self' https://fonts.gstatic.com", // Allow Google Fonts
    "img-src 'self' data: https: blob:", // Allow images from HTTPS sources
    "connect-src 'self' https://api.campbellco.com https://*.supabase.co https://*.netlify.app wss://*.supabase.co", // API connections
    "frame-ancestors 'none'", // Prevent clickjacking
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "worker-src 'self' blob:", // Allow web workers
    "manifest-src 'self'"
  ].join('; '),
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS filter
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': [
    'geolocation=()',
    'camera=()',
    'microphone=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()'
  ].join(', '),
  
  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Certificate Transparency
  'Expect-CT': 'max-age=86400, enforce'
};

/**
 * Generate meta tags for security headers that can be set client-side
 */
export function generateSecurityMetaTags(): string {
  return `
    <meta http-equiv="Content-Security-Policy" content="${securityHeaders['Content-Security-Policy']}">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta name="referrer" content="strict-origin-when-cross-origin">
  `;
}

/**
 * Netlify headers configuration
 * Add this to your netlify.toml or _headers file
 */
export const netlifyHeaders = `
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "${securityHeaders['Content-Security-Policy']}"
    X-Frame-Options = "${securityHeaders['X-Frame-Options']}"
    X-Content-Type-Options = "${securityHeaders['X-Content-Type-Options']}"
    X-XSS-Protection = "${securityHeaders['X-XSS-Protection']}"
    Referrer-Policy = "${securityHeaders['Referrer-Policy']}"
    Permissions-Policy = "${securityHeaders['Permissions-Policy']}"
    Strict-Transport-Security = "${securityHeaders['Strict-Transport-Security']}"
    
[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    
[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
`;

/**
 * Vite plugin to add security headers in development
 */
export function viteSecurityHeaders() {
  return {
    name: 'security-headers',
    configureServer(server: any) {
      server.middlewares.use((_req: any, res: any, next: any) => {
        // Add security headers to all responses
        Object.entries(securityHeaders).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        next();
      });
    }
  };
}