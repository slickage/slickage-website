#!/usr/bin/env bun

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import {
  checkRateLimit,
  getRateLimitStatus,
  resetRateLimit,
} from '../../src/lib/security/rate-limiter';
import { initializeRedis } from '../../src/lib/utils/redis';

describe('Redis Rate Limiting Integration Tests', () => {
  const testIp = '192.168.1.100';

  beforeEach(async () => {
    // Initialize Redis connection before each test
    await initializeRedis();

    // Wait a moment for connection to establish
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  afterEach(async () => {
    // Reset rate limit after each test
    await resetRateLimit(testIp);
  });

  it('should handle initial rate limit status', async () => {
    const status = await getRateLimitStatus(testIp);
    expect(status.remaining).toBe(3);
    expect(status.limited).toBe(false);
    expect(status.resetTime).toBeGreaterThan(Date.now());
  });

  it('should allow first three submissions', async () => {
    // First submission
    const firstResult = await checkRateLimit(testIp);
    expect(firstResult.limited).toBe(false);
    expect(firstResult.remaining).toBe(2);

    // Second submission
    const secondResult = await checkRateLimit(testIp);
    expect(secondResult.limited).toBe(false);
    expect(secondResult.remaining).toBe(1);

    // Third submission
    const thirdResult = await checkRateLimit(testIp);
    expect(thirdResult.limited).toBe(false);
    expect(thirdResult.remaining).toBe(0);
  });

  it('should block fourth submission', async () => {
    // Use up all attempts
    await checkRateLimit(testIp);
    await checkRateLimit(testIp);
    await checkRateLimit(testIp);

    // Fourth submission should be blocked
    const fourthResult = await checkRateLimit(testIp);
    expect(fourthResult.limited).toBe(true);
    expect(fourthResult.remaining).toBe(0);
  });

  it('should reset rate limit correctly', async () => {
    // Use up all attempts
    await checkRateLimit(testIp);
    await checkRateLimit(testIp);
    await checkRateLimit(testIp);

    // Reset
    const resetSuccess = await resetRateLimit(testIp);
    expect(resetSuccess).toBe(true);

    // Verify reset
    const status = await getRateLimitStatus(testIp);
    expect(status.remaining).toBe(3);
    expect(status.limited).toBe(false);
  });
});
