/**
 * API retry logic with exponential backoff
 * Handles transient network failures gracefully
 */

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryCondition?: (error: any) => boolean;
  onRetry?: (error: any, retryCount: number) => void;
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
      return true;
    }
    if (error.status && error.status >= 500) {
      return true;
    }
    // Retry on 429 (rate limit)
    if (error.status === 429) {
      return true;
    }
    return false;
  },
  onRetry: () => {}
};

/**
 * Wraps an async function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: any;
  let delay = opts.initialDelay;
  
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      if (attempt === opts.maxRetries || !opts.retryCondition(error)) {
        throw error;
      }
      
      // Call retry callback
      opts.onRetry(error, attempt + 1);
      
      // Wait before retrying
      await sleep(delay);
      
      // Increase delay for next attempt
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
    }
  }
  
  throw lastError;
}

/**
 * Wraps fetch with retry logic
 */
export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  options?: RetryOptions
): Promise<Response> {
  return withRetry(async () => {
    const response = await fetch(url, init);
    
    // Throw error for non-ok responses to trigger retry logic
    if (!response.ok) {
      const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }
    
    return response;
  }, options);
}

/**
 * Rate limiter for API calls
 */
export class RateLimiter {
  private queue: Array<() => void> = [];
  private running = 0;
  
  constructor(
    private maxConcurrent: number,
    private minDelay: number = 100
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.waitForSlot();
    
    try {
      this.running++;
      const start = Date.now();
      const result = await fn();
      
      // Ensure minimum delay between requests
      const elapsed = Date.now() - start;
      if (elapsed < this.minDelay) {
        await sleep(this.minDelay - elapsed);
      }
      
      return result;
    } finally {
      this.running--;
      this.processQueue();
    }
  }
  
  private waitForSlot(): Promise<void> {
    if (this.running < this.maxConcurrent) {
      return Promise.resolve();
    }
    
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }
  
  private processQueue() {
    if (this.queue.length > 0 && this.running < this.maxConcurrent) {
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

// Utility function for delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Pre-configured rate limiters for different services
export const rateLimiters = {
  // Web search service - 2 requests per second
  webSearch: new RateLimiter(2, 500),
  
  // Company intelligence - 1 request per second
  companyIntel: new RateLimiter(1, 1000),
  
  // Database operations - 5 concurrent
  database: new RateLimiter(5, 100)
};