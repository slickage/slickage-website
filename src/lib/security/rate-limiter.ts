import { logger } from '../utils/logger';

const MAX_SUBMISSIONS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

const submissionTimes = new Map<string, number[]>();

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if IP is rate limited and update submission count
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const times = submissionTimes.get(ip) || [];

  const recentTimes = times.filter((time) => now - time < RATE_LIMIT_WINDOW);

  if (recentTimes.length >= MAX_SUBMISSIONS_PER_HOUR) {
    const oldestSubmission = Math.min(...recentTimes);
    const resetTime = oldestSubmission + RATE_LIMIT_WINDOW;

    logger.security(`Rate limit exceeded: IP ${ip}`);

    return {
      limited: true,
      remaining: 0,
      resetTime,
    };
  }

  recentTimes.push(now);
  submissionTimes.set(ip, recentTimes);

  return {
    limited: false,
    remaining: MAX_SUBMISSIONS_PER_HOUR - recentTimes.length,
    resetTime: now + RATE_LIMIT_WINDOW,
  };
}

export { MAX_SUBMISSIONS_PER_HOUR };
