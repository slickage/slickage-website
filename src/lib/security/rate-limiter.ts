import { logger } from '../utils/logger';

// Allow simple overrides without touching central env module
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX ?? 3);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60 * 60 * 1000);

// Backwards-compatible export name
export const MAX_SUBMISSIONS_PER_HOUR = RATE_LIMIT_MAX;

const submissionTimes = new Map<string, number[]>();

let cleanupTimer: NodeJS.Timeout | null = null;
function startCleanupScheduler(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    // Prune old timestamps and drop stale keys
    for (const [ip, times] of submissionTimes.entries()) {
      const recent = times.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
      if (recent.length > 0) {
        submissionTimes.set(ip, recent);
      } else {
        submissionTimes.delete(ip);
      }
    }
  }, Math.max(30_000, Math.min(RATE_LIMIT_WINDOW_MS, 5 * 60_000)));
  // Do not keep the event loop alive for this timer
  cleanupTimer.unref?.();
}

startCleanupScheduler();

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetTime: number;
}

function computeResetTime(recentTimes: number[], now: number): number {
  if (recentTimes.length === 0) return now + RATE_LIMIT_WINDOW_MS;
  const oldest = Math.min(...recentTimes);
  return oldest + RATE_LIMIT_WINDOW_MS;
}

/**
 * Check if IP is rate limited and update submission count (sliding window)
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const times = submissionTimes.get(ip) ?? [];
  const recentTimes = times.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recentTimes.length >= RATE_LIMIT_MAX) {
    const resetTime = computeResetTime(recentTimes, now);
    logger.security(`Rate limit exceeded: IP ${ip}`);
    return { limited: true, remaining: 0, resetTime };
  }

  recentTimes.push(now);
  submissionTimes.set(ip, recentTimes);

  const remaining = RATE_LIMIT_MAX - recentTimes.length;
  const resetTime = computeResetTime(recentTimes, now);
  return { limited: false, remaining, resetTime };
}

/**
 * Build standard rate limit headers for responses
 */
export function buildRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
    'X-RateLimit-Remaining': String(Math.max(0, result.remaining)),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };

  if (result.limited) {
    const retryAfterSeconds = Math.max(0, Math.ceil((result.resetTime - Date.now()) / 1000));
    headers['Retry-After'] = String(retryAfterSeconds);
  }
  return headers;
}
