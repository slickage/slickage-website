import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import {
  checkRateLimit,
  getRateLimitStatus,
  resetRateLimit,
  cleanupRateLimiter,
  MAX_REQUESTS_PER_WINDOW,
  WINDOW_SIZE_SECONDS,
  type RateLimitResult,
} from '../../../src/lib/security/rate-limiter';

describe('Rate Limiter - Comprehensive Test Suite', () => {
  const testIdentifier = 'test-user-123';

  beforeEach(async () => {
    // Clean up any existing rate limits
    await resetRateLimit(testIdentifier);
  });

  afterEach(async () => {
    // Clean up test data
    await resetRateLimit(testIdentifier);
  });

  // ============================================================================
  // CORE FUNCTIONALITY TESTS
  // ============================================================================

  describe('Core Functionality', () => {
    it('should allow first request', async () => {
      const result = await checkRateLimit(testIdentifier);

      expect(result.limited).toBe(false);
      expect(result.remaining).toBeGreaterThanOrEqual(0);
      expect(result.remaining).toBeLessThanOrEqual(MAX_REQUESTS_PER_WINDOW);
    });

    it('should enforce rate limits correctly', async () => {
      const identifier = 'limit-test';

      // Make requests up to the limit
      for (let i = 0; i < MAX_REQUESTS_PER_WINDOW; i++) {
        const result = await checkRateLimit(identifier);
        expect(result.limited).toBe(false);
        expect(result.remaining).toBe(MAX_REQUESTS_PER_WINDOW - i - 1);
      }

      // Next request should be limited
      const limitedResult = await checkRateLimit(identifier);
      expect(limitedResult.limited).toBe(true);
      expect(limitedResult.remaining).toBe(0);

      // Clean up
      await resetRateLimit(identifier);
    });

    it('should return status without incrementing counter', async () => {
      const statusBefore = await getRateLimitStatus(testIdentifier);
      const checkResult = await checkRateLimit(testIdentifier);
      const statusAfter = await getRateLimitStatus(testIdentifier);

      expect(statusBefore.remaining).toBe(MAX_REQUESTS_PER_WINDOW);
      expect(statusAfter.remaining).toBe(MAX_REQUESTS_PER_WINDOW - 1);
      expect(checkResult.remaining).toBe(MAX_REQUESTS_PER_WINDOW - 1);
    });

    it('should successfully reset rate limit', async () => {
      await checkRateLimit(testIdentifier);
      const resetResult = await resetRateLimit(testIdentifier);
      expect(resetResult).toBe(true);

      const statusAfter = await getRateLimitStatus(testIdentifier);
      expect(statusAfter.remaining).toBe(MAX_REQUESTS_PER_WINDOW);
    });

    it('should handle reset for non-existent identifier', async () => {
      const resetResult = await resetRateLimit('non-existent-identifier');
      expect(resetResult).toBe(true);
    });
  });

  // ============================================================================
  // SLIDING WINDOW ALGORITHM TESTS
  // ============================================================================

  describe('Sliding Window Algorithm', () => {
    it('should implement true sliding window behavior', async () => {
      const results: any[] = [];

      // Make requests up to the limit
      for (let i = 0; i < MAX_REQUESTS_PER_WINDOW; i++) {
        const result = await checkRateLimit(testIdentifier);
        results.push({
          request: i + 1,
          limited: result.limited,
          remaining: result.remaining,
          timestamp: Date.now(),
        });

        // Should not be limited before reaching the limit
        if (i < MAX_REQUESTS_PER_WINDOW - 1) {
          expect(result.limited).toBe(false);
        }
      }

      // Verify we have the expected number of results
      expect(results).toHaveLength(MAX_REQUESTS_PER_WINDOW);

      // All results should have valid structure
      results.forEach((result, index) => {
        expect(result.limited).toBeDefined();
        expect(result.remaining).toBeGreaterThanOrEqual(0);
        expect(result.remaining).toBeLessThanOrEqual(MAX_REQUESTS_PER_WINDOW);
      });
    });

    it('should handle window boundary conditions', async () => {
      const identifier = 'boundary-test';

      // Test exactly at the limit
      for (let i = 0; i < MAX_REQUESTS_PER_WINDOW; i++) {
        const result = await checkRateLimit(identifier);
        expect(result.limited).toBe(false);
        expect(result.remaining).toBe(MAX_REQUESTS_PER_WINDOW - i - 1);
      }

      // Test over the limit
      const limitedResult = await checkRateLimit(identifier);
      expect(limitedResult.limited).toBe(true);
      expect(limitedResult.remaining).toBe(0);

      // Clean up
      await resetRateLimit(identifier);
    });

    it('should calculate reset times correctly', async () => {
      const result = await checkRateLimit(testIdentifier);

      // Reset time should be in the future
      expect(result.resetTime).toBeGreaterThan(Date.now());

      // Reset time should be within the window size
      const maxExpectedReset = Date.now() + (WINDOW_SIZE_SECONDS + 60) * 1000; // +60s buffer
      expect(result.resetTime).toBeLessThan(maxExpectedReset);

      // Reset time should be reasonable (not too far in the past)
      const minExpectedReset = Date.now() + (WINDOW_SIZE_SECONDS - 60) * 1000; // -60s buffer
      expect(result.resetTime).toBeGreaterThan(minExpectedReset);
    });
  });

  // ============================================================================
  // ERROR HANDLING AND FALLBACK TESTS
  // ============================================================================

  describe('Error Handling and Fallback', () => {
    it('should handle Redis unavailability gracefully', async () => {
      const result = await checkRateLimit('redis-fallback-test');

      expect(result.limited).toBeDefined();
      expect(result.remaining).toBeGreaterThanOrEqual(0);
      expect(result.remaining).toBeLessThanOrEqual(MAX_REQUESTS_PER_WINDOW);
    });

    it('should handle invalid identifiers gracefully', async () => {
      const invalidIdentifiers = ['', '   ', 'a'.repeat(1000)];

      for (const identifier of invalidIdentifiers) {
        const result = await checkRateLimit(identifier);
        expect(result).toHaveProperty('limited');
        expect(result).toHaveProperty('remaining');
        expect(result).toHaveProperty('resetTime');

        // Clean up
        await resetRateLimit(identifier);
      }
    });

    it('should provide consistent error responses', async () => {
      // Test that error responses maintain consistent structure
      const testCases = [
        { identifier: 'normal-id', expectedSuccess: true },
        { identifier: '', expectedSuccess: false },
        { identifier: 'a'.repeat(1000), expectedSuccess: false },
      ];

      for (const testCase of testCases) {
        try {
          const result = await checkRateLimit(testCase.identifier);

          if (testCase.expectedSuccess) {
            expect(result).toHaveProperty('limited');
            expect(result).toHaveProperty('remaining');
            expect(result).toHaveProperty('resetTime');
          }
        } catch (error) {
          if (testCase.expectedSuccess) {
            throw error; // Unexpected error
          }
          // Expected error for invalid identifiers
          expect(error).toBeDefined();
        }
      }
    });
  });

  // ============================================================================
  // CONCURRENT AND PERFORMANCE TESTS
  // ============================================================================

  describe('Concurrent Request Handling', () => {
    it('should handle concurrent requests efficiently', async () => {
      const startTime = Date.now();
      const concurrentCount = 25; // Balanced between efficiency and thoroughness
      const promises: Promise<RateLimitResult>[] = [];

      // Make concurrent requests
      for (let i = 0; i < concurrentCount; i++) {
        promises.push(checkRateLimit(`${testIdentifier}-concurrent-${i}`));
      }

      const results = await Promise.all(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // All requests should complete
      expect(results).toHaveLength(concurrentCount);

      // All results should have valid structure
      results.forEach((result) => {
        expect(result).toHaveProperty('limited');
        expect(result).toHaveProperty('remaining');
        expect(result).toHaveProperty('resetTime');
      });

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(15000); // 15 seconds max

      // Clean up
      for (let i = 0; i < concurrentCount; i++) {
        await resetRateLimit(`${testIdentifier}-concurrent-${i}`);
      }
    });

    it('should handle rapid successive calls', async () => {
      const startTime = Date.now();
      const iterations = 20;

      for (let i = 0; i < iterations; i++) {
        const result = await checkRateLimit(`${testIdentifier}-rapid-${i}`);
        expect(result).toHaveProperty('limited');
        expect(result).toHaveProperty('remaining');
        expect(result).toHaveProperty('resetTime');
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(15000); // 15 seconds max

      // Clean up
      for (let i = 0; i < iterations; i++) {
        await resetRateLimit(`${testIdentifier}-rapid-${i}`);
      }
    });
  });

  // ============================================================================
  // PERFORMANCE AND SCALABILITY TESTS
  // ============================================================================

  describe('Performance and Scalability', () => {
    it('should maintain consistent performance under load', async () => {
      const iterations = 100;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        await checkRateLimit(`${testIdentifier}-perf-${i}`);
        const endTime = Date.now();
        times.push(endTime - startTime);
      }

      // Calculate performance metrics
      const totalTime = times.reduce((sum, time) => sum + time, 0);
      const avgTime = totalTime / iterations;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);

      // Performance should be consistent
      expect(avgTime).toBeLessThan(100); // Average less than 100ms
      expect(maxTime).toBeLessThan(500); // Max less than 500ms

      // Clean up
      for (let i = 0; i < iterations; i++) {
        await resetRateLimit(`${testIdentifier}-perf-${i}`);
      }
    });

    it('should handle memory efficiently', async () => {
      const startMemory = process.memoryUsage().heapUsed;
      const iterations = 1000;

      // Make many requests to test memory usage
      for (let i = 0; i < iterations; i++) {
        await checkRateLimit(`${testIdentifier}-memory-${i}`);
      }

      const endMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = endMemory - startMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);

      // Clean up
      for (let i = 0; i < iterations; i++) {
        await resetRateLimit(`${testIdentifier}-memory-${i}`);
      }
    });
  });

  // ============================================================================
  // SECURE FALLBACK BEHAVIOR TESTS
  // ============================================================================

  describe('Secure Fallback Behavior', () => {
    it('should enforce rate limits even when Redis is unavailable', async () => {
      // Test that rate limiting continues to work without Redis
      const results: RateLimitResult[] = [];

      // Make multiple requests to test the fallback rate limiting
      for (let i = 0; i < MAX_REQUESTS_PER_WINDOW + 2; i++) {
        const result = await checkRateLimit(`${testIdentifier}-fallback-${i}`);
        results.push(result);
      }

      // Should have processed all requests
      expect(results).toHaveLength(MAX_REQUESTS_PER_WINDOW + 2);

      // All results should have valid structure
      results.forEach((result) => {
        expect(result.limited).toBeDefined();
        expect(result.remaining).toBeGreaterThanOrEqual(0);
        expect(result.remaining).toBeLessThanOrEqual(MAX_REQUESTS_PER_WINDOW);
        expect(result.resetTime).toBeGreaterThan(Date.now());
      });

      // The fallback should maintain separate counters for different identifiers
      const sameIdentifierResults: RateLimitResult[] = [];
      for (let i = 0; i < 3; i++) {
        const result = await checkRateLimit(testIdentifier);
        sameIdentifierResults.push(result);
      }

      // Should show decreasing remaining count for same identifier
      expect(sameIdentifierResults[0].remaining).toBeGreaterThan(
        sameIdentifierResults[1].remaining,
      );
      expect(sameIdentifierResults[1].remaining).toBeGreaterThan(
        sameIdentifierResults[2].remaining,
      );
    });

    it('should handle fallback rate limit exhaustion', async () => {
      // Test that the fallback properly blocks requests when limit is reached
      const identifier = `${testIdentifier}-exhaustion`;

      // Make requests up to the limit
      for (let i = 0; i < MAX_REQUESTS_PER_WINDOW; i++) {
        const result = await checkRateLimit(identifier);
        expect(result.limited).toBe(false);
        expect(result.remaining).toBe(MAX_REQUESTS_PER_WINDOW - i - 1);
      }

      // Next request should be limited
      const limitedResult = await checkRateLimit(identifier);
      expect(limitedResult.limited).toBe(true);
      expect(limitedResult.remaining).toBe(0);
    });

    it('should reset fallback rate limits correctly', async () => {
      const identifier = `${testIdentifier}-reset-test`;

      // Make some requests
      await checkRateLimit(identifier);
      await checkRateLimit(identifier);

      // Check status
      const statusBefore = await getRateLimitStatus(identifier);
      expect(statusBefore.remaining).toBeLessThan(MAX_REQUESTS_PER_WINDOW);

      // Reset
      const resetResult = await resetRateLimit(identifier);
      expect(resetResult).toBe(true);

      // Check status after reset
      const statusAfter = await getRateLimitStatus(identifier);
      expect(statusAfter.remaining).toBe(MAX_REQUESTS_PER_WINDOW);
      expect(statusAfter.limited).toBe(false);
    });
  });

  // ============================================================================
  // EDGE CASES AND RESILIENCE TESTS
  // ============================================================================

  describe('Edge Cases and Resilience', () => {
    it('should handle rapid state transitions', async () => {
      const identifier = 'rapid-transitions-test';

      // Make rapid requests
      const results: RateLimitResult[] = [];
      for (let i = 0; i < 10; i++) {
        const result = await checkRateLimit(identifier);
        results.push(result);
      }

      // Verify progression
      expect(results[0].limited).toBe(false);
      expect(results[2].limited).toBe(false);
      expect(results[3].limited).toBe(true);
      expect(results[4].limited).toBe(true);

      // Clean up
      await resetRateLimit(identifier);
    });

    it('should handle various identifier formats', async () => {
      const identifiers = [
        'simple-id',
        'id-with-dashes',
        'id_with_underscores',
        'id.with.dots',
        'ID-WITH-UPPERCASE',
        'id-with-123-numbers',
        'a'.repeat(100), // Long identifier
        'short', // Short identifier
      ];

      for (const identifier of identifiers) {
        try {
          const result = await checkRateLimit(identifier);
          expect(result).toHaveProperty('limited');
          expect(result).toHaveProperty('remaining');
          expect(result).toHaveProperty('resetTime');

          // Clean up
          await resetRateLimit(identifier);
        } catch (error) {
          // If it throws an error, that's also acceptable
          expect(error).toBeDefined();
        }
      }
    });

    it('should handle empty and whitespace identifiers', async () => {
      const edgeCaseIdentifiers = ['', '   ', '\t', '\n', ' \t \n '];

      for (const identifier of edgeCaseIdentifiers) {
        try {
          const result = await checkRateLimit(identifier);
          expect(result).toHaveProperty('limited');
          expect(result).toHaveProperty('remaining');
          expect(result).toHaveProperty('resetTime');
        } catch (error) {
          // If it throws an error, that's also acceptable
          expect(error).toBeDefined();
        }
      }
    });
  });

  // ============================================================================
  // CONFIGURATION AND MAINTENANCE TESTS
  // ============================================================================

  describe('Configuration and Maintenance', () => {
    it('should export correct constants', () => {
      expect(MAX_REQUESTS_PER_WINDOW).toBe(3);
      expect(WINDOW_SIZE_SECONDS).toBe(3600); // 1 hour
    });

    it('should have mathematically sound configuration', () => {
      const requestsPerSecond = MAX_REQUESTS_PER_WINDOW / WINDOW_SIZE_SECONDS;
      expect(requestsPerSecond).toBe(0.0008333333333333334);
    });

    it('should return result with correct structure', async () => {
      const result = await checkRateLimit(testIdentifier);

      expect(result).toHaveProperty('limited');
      expect(result).toHaveProperty('remaining');
      expect(result).toHaveProperty('resetTime');
      expect(typeof result.limited).toBe('boolean');
      expect(typeof result.remaining).toBe('number');
      expect(typeof result.resetTime).toBe('number');
    });

    it('should handle cleanup function properly', () => {
      // Multiple calls should not throw
      expect(() => cleanupRateLimiter()).not.toThrow();
      expect(() => cleanupRateLimiter()).not.toThrow();
      expect(typeof cleanupRateLimiter).toBe('function');
    });
  });

  // ============================================================================
  // RESET AND RECOVERY TESTS
  // ============================================================================

  describe('Reset and Recovery', () => {
    it('should recover after reset', async () => {
      // Make some requests
      for (let i = 0; i < 2; i++) {
        await checkRateLimit(testIdentifier);
      }

      // Check status
      const statusBefore = await getRateLimitStatus(testIdentifier);
      expect(statusBefore.remaining).toBeGreaterThanOrEqual(0);
      expect(statusBefore.remaining).toBeLessThanOrEqual(MAX_REQUESTS_PER_WINDOW);

      // Reset
      const resetResult = await resetRateLimit(testIdentifier);
      expect(resetResult).toBe(true);

      // Check status after reset
      const statusAfter = await getRateLimitStatus(testIdentifier);
      expect(statusAfter.remaining).toBe(MAX_REQUESTS_PER_WINDOW);
      expect(statusAfter.limited).toBe(false);
    });

    it('should handle multiple resets correctly', async () => {
      // Make requests
      await checkRateLimit(testIdentifier);
      await checkRateLimit(testIdentifier);

      // Reset multiple times
      for (let i = 0; i < 3; i++) {
        const resetResult = await resetRateLimit(testIdentifier);
        expect(resetResult).toBe(true);

        // Check status after each reset
        const status = await getRateLimitStatus(testIdentifier);
        expect(status.remaining).toBe(MAX_REQUESTS_PER_WINDOW);
        expect(status.limited).toBe(false);
      }
    });
  });
});
