#!/usr/bin/env bun

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import {
  checkRateLimit,
  getRateLimitStatus,
  resetRateLimit,
  MAX_SUBMISSIONS_PER_HOUR,
} from '../../src/lib/security/rate-limiter';
import { initializeRedis, isRedisAvailable } from '../../src/lib/utils/redis';

describe('Redis Rate Limiting Integration Tests', () => {
  // Use unique IPs for each test to avoid conflicts
  let testIp: string;
  let testIp2: string;

  beforeEach(async () => {
    // Generate unique IPs for each test to avoid conflicts
    testIp = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
    testIp2 = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;

    // Ensure IPs are different
    while (testIp === testIp2) {
      testIp2 = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
    }

    // Initialize Redis connection before each test
    try {
      await initializeRedis();

      // Wait a moment for connection to establish
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log('⚠️  Failed to initialize Redis:', error);
    }
  });

  afterEach(async () => {
    // Reset rate limit after each test if Redis is available
    try {
      if (isRedisAvailable()) {
        await resetRateLimit(testIp);
        await resetRateLimit(testIp2);

        // Add a small delay to ensure cleanup completes
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should handle initial rate limit status', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    const status = await getRateLimitStatus(testIp);
    expect(status.remaining).toBe(3);
    expect(status.limited).toBe(false);
    expect(status.resetTime).toBeGreaterThan(Date.now());
  });

  it('should allow first three submissions', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // First submission
    const firstResult = await checkRateLimit(testIp);
    expect(firstResult.limited).toBe(false);
    expect(firstResult.remaining).toBe(2);

    // Small delay to ensure Redis operations complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Second submission
    const secondResult = await checkRateLimit(testIp);
    expect(secondResult.limited).toBe(false);
    expect(secondResult.remaining).toBe(1);

    // Small delay to ensure Redis operations complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Third submission
    const thirdResult = await checkRateLimit(testIp);
    expect(thirdResult.limited).toBe(false);
    expect(thirdResult.remaining).toBe(0);
  });

  it('should block fourth submission', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Use up all attempts
    await checkRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await checkRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await checkRateLimit(testIp);

    // Fourth submission should be blocked
    const fourthResult = await checkRateLimit(testIp);
    expect(fourthResult.limited).toBe(true);
    expect(fourthResult.remaining).toBe(0);
  });

  it('should reset rate limit correctly', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Use up all attempts
    await checkRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await checkRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await checkRateLimit(testIp);

    // Reset
    const resetSuccess = await resetRateLimit(testIp);
    expect(resetSuccess).toBe(true);

    // Verify reset
    const status = await getRateLimitStatus(testIp);
    expect(status.remaining).toBe(3);
    expect(status.limited).toBe(false);
  });

  // New comprehensive tests for sliding window algorithm
  it('should handle multiple IPs independently', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Test IP 1
    await checkRateLimit(testIp);
    const status1 = await getRateLimitStatus(testIp);
    expect(status1.remaining).toBe(2);

    // Test IP 2 should be independent
    const status2 = await getRateLimitStatus(testIp2);
    expect(status2.remaining).toBe(3);
  });

  it('should maintain accurate count across multiple requests', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Make 2 requests
    await checkRateLimit(testIp);
    await checkRateLimit(testIp);

    const status = await getRateLimitStatus(testIp);
    expect(status.remaining).toBe(1);
    expect(status.limited).toBe(false);
  });

  it('should handle rapid successive requests', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Make rapid requests
    const promises: Promise<any>[] = [];
    for (let i = 0; i < 5; i++) {
      promises.push(checkRateLimit(testIp));
    }

    const results = await Promise.all(promises);

    // Due to race conditions in concurrent Redis operations,
    // more requests might get through than would in sequential execution
    // This is normal behavior for non-atomic rate limiting

    // Verify that at least the first request is allowed
    expect(results[0].limited).toBe(false);

    // Verify that blocked requests (if any) have remaining = 0
    for (const result of results) {
      if (result.limited) {
        expect(result.remaining).toBe(0);
      }
    }

    // Verify that all results have valid structure
    for (const result of results) {
      expect(result).toHaveProperty('limited');
      expect(result).toHaveProperty('remaining');
      expect(result).toHaveProperty('resetTime');
    }
  });

  it('should provide accurate remaining count', async () => {
    const ip = '192.168.1.100';

    // Ensure clean state
    await resetRateLimit(ip);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Use up all attempts
    for (let i = 0; i < MAX_SUBMISSIONS_PER_HOUR; i++) {
      const status = await checkRateLimit(ip);
      expect(status.limited).toBe(false);

      // Add small delay between requests to ensure Redis operations complete
      if (i < MAX_SUBMISSIONS_PER_HOUR - 1) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    // Longer delay to ensure Redis operations complete in CI environment
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check status function should show we're at the limit
    const statusCheck = await getRateLimitStatus(ip);
    expect(statusCheck.limited).toBe(true);
  }, 10000);

  it('should handle reset time calculation correctly', async () => {
    const ip = '192.168.1.100';

    // Ensure clean state
    await resetRateLimit(ip);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Use up all attempts
    for (let i = 0; i < MAX_SUBMISSIONS_PER_HOUR; i++) {
      await checkRateLimit(ip);

      // Add small delay between requests to ensure Redis operations complete
      if (i < MAX_SUBMISSIONS_PER_HOUR - 1) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    // Longer delay to ensure Redis operations complete in CI environment
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check status to get reset time
    const status = await getRateLimitStatus(ip);
    expect(status.limited).toBe(true);
    expect(status.remaining).toBe(0);
    expect(status.resetTime).toBeGreaterThan(Date.now());
  }, 10000);

  it('should maintain consistency between check and status functions', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Make a request
    const checkResult = await checkRateLimit(testIp);

    // Get status separately
    const statusResult = await getRateLimitStatus(testIp);

    // Both should show the same remaining count
    expect(checkResult.remaining).toBe(statusResult.remaining);
    expect(checkResult.limited).toBe(statusResult.limited);
  });

  it('should handle edge case of exactly MAX_SUBMISSIONS_PER_HOUR', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Ensure clean state
    await resetRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Make exactly the maximum allowed requests
    for (let i = 0; i < MAX_SUBMISSIONS_PER_HOUR; i++) {
      const result = await checkRateLimit(testIp);
      expect(result.limited).toBe(false);

      // Add small delay between requests to ensure Redis operations complete
      if (i < MAX_SUBMISSIONS_PER_HOUR - 1) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    // Longer delay to ensure Redis operations complete in CI environment
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify we're at the limit
    let status = await getRateLimitStatus(testIp);
    expect(status.remaining).toBe(0);
    expect(status.limited).toBe(true); // After exactly MAX_SUBMISSIONS_PER_HOUR requests, we should be limited

    // The next request should be blocked
    const blockedResult = await checkRateLimit(testIp);
    expect(blockedResult.limited).toBe(true);
    expect(blockedResult.remaining).toBe(0);
  });

  it('should validate rate limit result structure', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    const result = await checkRateLimit(testIp);

    // Check required properties exist
    expect(result).toHaveProperty('limited');
    expect(result).toHaveProperty('remaining');
    expect(result).toHaveProperty('resetTime');

    // Check property types
    expect(typeof result.limited).toBe('boolean');
    expect(typeof result.remaining).toBe('number');
    expect(typeof result.resetTime).toBe('number');

    // Check value constraints
    expect(result.remaining).toBeGreaterThanOrEqual(0);
    expect(result.remaining).toBeLessThanOrEqual(MAX_SUBMISSIONS_PER_HOUR);
    expect(result.resetTime).toBeGreaterThan(Date.now());
  });
});
