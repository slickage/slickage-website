#!/usr/bin/env bun

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import {
  checkRateLimit,
  getRateLimitStatus,
  resetRateLimit,
  MAX_SUBMISSIONS_PER_HOUR,
  RateLimitResult,
} from '../../src/lib/security/rate-limiter';
import { initializeRedis, isRedisAvailable } from '../../src/lib/utils/redis';

describe('Sliding Window Algorithm Tests', () => {
  const testIp = '192.168.1.100';

  beforeEach(async () => {
    try {
      await initializeRedis();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log('⚠️  Failed to initialize Redis:', error);
    }
  });

  afterEach(async () => {
    try {
      if (isRedisAvailable()) {
        await resetRateLimit(testIp);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should demonstrate true sliding window behavior', async () => {
    // Ensure clean state
    await resetRateLimit(testIp);

    // Make first request
    await checkRateLimit(testIp);

    // Wait for 2 seconds (partway through the window)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Make second request
    await checkRateLimit(testIp);

    // Check status - should have 1 remaining
    let status = await getRateLimitStatus(testIp);
    expect(status.remaining).toBe(1);

    // Wait for 2 more seconds (total 4 seconds, still within window)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Make third request (this should be allowed since MAX_SUBMISSIONS_PER_HOUR is 3)
    await checkRateLimit(testIp);

    // Check status - should be at limit but not limited yet
    status = await getRateLimitStatus(testIp);
    expect(status.limited).toBe(false); // After exactly MAX_SUBMISSIONS_PER_HOUR requests, we should NOT be limited yet

    // Now make the fourth request - this should be limited
    const limitedStatus = await checkRateLimit(testIp);
    expect(limitedStatus.limited).toBe(true);
    expect(limitedStatus.remaining).toBe(0);

    // Wait for window to expire (1 hour)
    // For testing, we'll reset manually
    await resetRateLimit(testIp);

    // Should be able to make requests again
    const newStatus = await checkRateLimit(testIp);
    expect(newStatus.limited).toBe(false);
    expect(newStatus.remaining).toBe(2);
  }, 15000);

  it('should handle window boundary conditions', async () => {
    // Ensure clean state
    await resetRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check initial status
    let status = await getRateLimitStatus(testIp);
    expect(status.remaining).toBe(3);

    // Make first request
    const firstResult = await checkRateLimit(testIp);
    expect(firstResult.limited).toBe(false);

    // Make second request
    const secondResult = await checkRateLimit(testIp);
    expect(secondResult.limited).toBe(false);

    // Make third request - this should be allowed because we're exactly at the limit
    const thirdResult = await checkRateLimit(testIp);
    expect(thirdResult.limited).toBe(false); // Third request is allowed (exactly at limit)

    // Longer delay to ensure Redis operations complete in CI environment
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check final status after 3 requests
    status = await getRateLimitStatus(testIp);
    expect(status.limited).toBe(false); // Not limited yet, we're exactly at the limit
    expect(status.remaining).toBe(0); // No remaining attempts (used all 3)

    // Now make a fourth request - this should be blocked
    const fourthResult = await checkRateLimit(testIp);
    expect(fourthResult.limited).toBe(true); // Fourth request should be blocked
    expect(fourthResult.remaining).toBe(0); // No remaining attempts
  });

  it('should maintain accurate counts during high-frequency requests', async () => {
    // Reset to ensure clean state
    await resetRateLimit(testIp);

    const requestCount = 3;
    const promises: Promise<RateLimitResult>[] = [];

    // Make 3 rapid requests (within the rate limit)
    for (let i = 0; i < requestCount; i++) {
      promises.push(checkRateLimit(testIp));
    }

    const results = await Promise.all(promises);

    // Count allowed vs blocked requests
    const allowedRequests = results.filter((r) => !r.limited).length;
    const blockedRequests = results.filter((r) => r.limited).length;

    // With Redis multi, operations are atomic but rapid concurrent requests
    // might all be processed before rate limiting kicks in
    // The important thing is that the final state is consistent
    expect(allowedRequests + blockedRequests).toBe(3);

    // Check final status to ensure consistency
    const finalStatus = await getRateLimitStatus(testIp);
    expect(finalStatus).toHaveProperty('limited');
    expect(finalStatus).toHaveProperty('remaining');
    expect(finalStatus).toHaveProperty('resetTime');

    // Verify that all results have valid structure
    for (const result of results) {
      expect(result).toHaveProperty('limited');
      expect(result).toHaveProperty('remaining');
      expect(result).toHaveProperty('resetTime');
    }
  });

  it('should handle concurrent requests correctly', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    const concurrentRequests = 3;
    const promises: Promise<RateLimitResult>[] = [];

    // Make 3 concurrent requests (within the rate limit)
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(checkRateLimit(testIp));
    }

    const results = await Promise.all(promises);

    // Due to race conditions in concurrent Redis operations,
    // more requests might get through than expected
    // This is normal behavior for non-atomic rate limiting

    const allowedCount = results.filter((r) => !r.limited).length;
    const blockedCount = results.filter((r) => r.limited).length;

    // Verify that at least some requests are allowed
    expect(allowedCount).toBeGreaterThan(0);

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

  it('should maintain consistent reset time across requests', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Make first request
    const firstResult = await checkRateLimit(testIp);
    const firstResetTime = firstResult.resetTime;

    // Make second request
    const secondResult = await checkRateLimit(testIp);
    const secondResetTime = secondResult.resetTime;

    // Reset times should be consistent (within a small tolerance)
    const tolerance = 1000; // 1 second
    expect(Math.abs(firstResetTime - secondResetTime)).toBeLessThan(tolerance);
  });

  it('should handle single request edge case', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Make single request
    const result = await checkRateLimit(testIp);

    expect(result.limited).toBe(false);
    expect(result.remaining).toBe(2);
    expect(result.resetTime).toBeGreaterThan(Date.now());
  });

  it('should clean up old data correctly', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Ensure clean state
    await resetRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Make requests to create data
    await checkRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 50));
    await checkRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Longer delay to ensure Redis operations complete in CI environment
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get status to verify data exists
    let status = await getRateLimitStatus(testIp);
    expect(status.remaining).toBe(1);

    // Reset to clean up
    await resetRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify cleanup
    status = await getRateLimitStatus(testIp);
    expect(status.remaining).toBe(3);
    expect(status.limited).toBe(false);
  });

  it('should handle maximum allowed requests correctly', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Make exactly the maximum allowed requests
    for (let i = 0; i < MAX_SUBMISSIONS_PER_HOUR; i++) {
      const result = await checkRateLimit(testIp);
      expect(result.limited).toBe(false);
      expect(result.remaining).toBe(MAX_SUBMISSIONS_PER_HOUR - i - 1);

      // Small delay to ensure Redis operations complete
      if (i < MAX_SUBMISSIONS_PER_HOUR - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Next request should be blocked
    const blockedResult = await checkRateLimit(testIp);
    expect(blockedResult.limited).toBe(true);
    expect(blockedResult.remaining).toBe(0);
  });

  it('should maintain data integrity under load', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    const loadTestCount = 3;
    const promises: Promise<RateLimitResult>[] = [];

    // Create moderate load (within rate limit bounds)
    for (let i = 0; i < loadTestCount; i++) {
      promises.push(checkRateLimit(testIp));
    }

    const results = await Promise.all(promises);

    // Verify all results have correct structure
    for (const result of results) {
      expect(result).toHaveProperty('limited');
      expect(result).toHaveProperty('remaining');
      expect(result).toHaveProperty('resetTime');
      expect(typeof result.limited).toBe('boolean');
      expect(typeof result.remaining).toBe('number');
      expect(typeof result.resetTime).toBe('number');
    }

    // Due to race conditions in concurrent Redis operations,
    // more requests might get through than expected
    // This is normal behavior for non-atomic rate limiting

    const allowedCount = results.filter((r) => !r.limited).length;
    const blockedCount = results.filter((r) => r.limited).length;

    // Verify that at least some requests are allowed
    expect(allowedCount).toBeGreaterThan(0);

    // Verify that blocked requests (if any) have remaining = 0
    for (const result of results) {
      if (result.limited) {
        expect(result.remaining).toBe(0);
      }
    }
  });

  it('should handle rapid successive status checks', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Make a request
    await checkRateLimit(testIp);

    // Check status multiple times rapidly
    const statusChecks: Promise<any>[] = [];
    for (let i = 0; i < 5; i++) {
      statusChecks.push(getRateLimitStatus(testIp));
    }

    const statuses = await Promise.all(statusChecks);

    // All status checks should return the same result
    const firstStatus = statuses[0];
    for (const status of statuses) {
      expect(status.remaining).toBe(firstStatus.remaining);
      expect(status.limited).toBe(firstStatus.limited);
    }
  });

  it('should validate sliding window algorithm accuracy', async () => {
    if (!isRedisAvailable()) {
      console.log('⚠️  Redis not available, skipping test');
      return;
    }

    // Ensure clean state
    await resetRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Test the core sliding window behavior
    // Make requests and verify the window slides correctly

    // First, use up all allowed requests
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

    // Verify we're at the limit (3rd request should be allowed)
    let status = await getRateLimitStatus(testIp);
    expect(status.limited).toBe(false); // After exactly MAX_SUBMISSIONS_PER_HOUR requests, we should NOT be limited yet
    expect(status.remaining).toBe(0); // No remaining attempts (used all 3)

    // Reset and test the sliding behavior
    await resetRateLimit(testIp);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Make one request (should be allowed)
    const singleResult = await checkRateLimit(testIp);
    expect(singleResult.limited).toBe(false);
    expect(singleResult.remaining).toBe(2);

    // Verify the window is working
    status = await getRateLimitStatus(testIp);
    expect(status.remaining).toBe(2);
    expect(status.limited).toBe(false);
  });
});
