/**
 * Simple in-memory rate limiter.
 *
 * For production, swap the Map-based store with Upstash Redis:
 *   import { Ratelimit } from "@upstash/ratelimit";
 *   import { Redis } from "@upstash/redis";
 */

interface RateLimitOptions {
  /** Window duration in milliseconds */
  interval: number;
  /** Maximum number of unique tokens tracked per interval */
  uniqueTokenPerInterval: number;
}

interface TokenBucket {
  count: number;
  expiresAt: number;
}

export function rateLimit(options: RateLimitOptions) {
  const tokenMap = new Map<string, TokenBucket>();

  // Periodically clean up expired entries to prevent memory leaks
  const cleanup = () => {
    const now = Date.now();
    for (const [key, bucket] of Array.from(tokenMap.entries())) {
      if (bucket.expiresAt <= now) {
        tokenMap.delete(key);
      }
    }
  };

  setInterval(cleanup, options.interval);

  return {
    /**
     * Check whether the token has exceeded the rate limit.
     * Throws an error with status 429 if the limit is exceeded.
     */
    check: async (limit: number, token: string): Promise<void> => {
      const now = Date.now();
      const bucket = tokenMap.get(token);

      if (!bucket || bucket.expiresAt <= now) {
        // New window
        tokenMap.set(token, { count: 1, expiresAt: now + options.interval });

        // Evict oldest entries if we exceed the max unique tokens
        if (tokenMap.size > options.uniqueTokenPerInterval) {
          const firstKey = tokenMap.keys().next().value as string;
          tokenMap.delete(firstKey);
        }

        return;
      }

      // Existing window — increment and check
      bucket.count += 1;

      if (bucket.count > limit) {
        const error = new Error("Rate limit exceeded");
        (error as any).status = 429;
        throw error;
      }
    },
  };
}
