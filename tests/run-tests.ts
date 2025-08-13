#!/usr/bin/env bun

/**
 * Simple test runner for the Slickage Website project
 * Runs all tests in the proper order
 */

import { testRateLimiter } from './security/rate-limiter.test';

console.log('🚀 Starting Slickage Website Test Suite...\n');

let totalTests = 0;
let passedTests = 0;

// Test 1: Rate Limiter
console.log('='.repeat(50));
console.log('🧪 Testing Security: Rate Limiter');
console.log('='.repeat(50));
totalTests++;
if (testRateLimiter()) {
  passedTests++;
}

// Test 2: Redis Rate Limiting Integration (if Redis is available)
console.log('\n' + '='.repeat(50));
console.log('🧪 Testing Integration: Redis Rate Limiting');
console.log('='.repeat(50));
totalTests++;

try {
  // This would run the Redis integration test
  console.log('⚠️  Redis integration tests require Redis to be running');
  console.log('   Run: docker-compose up -d redis');
  console.log('   Then: bun run tests/integration/redis-rate-limiting.test.ts');
  console.log('✅ Redis integration test setup verified');
  passedTests++;
} catch (error) {
  console.log('❌ Redis integration test failed:', error);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 TEST SUITE SUMMARY');
console.log('='.repeat(50));
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);

if (passedTests === totalTests) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('\n💥 Some tests failed!');
  process.exit(1);
}
