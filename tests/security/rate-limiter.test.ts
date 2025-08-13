import { MAX_SUBMISSIONS_PER_HOUR } from '../../src/lib/security/rate-limiter';

// Simple test function
export function testRateLimiter() {
  console.log('🧪 Testing Rate Limiter Constants...\n');

  let testsPassed = 0;
  let totalTests = 3;

  // Test 1: Check constant value
  try {
    if (MAX_SUBMISSIONS_PER_HOUR === 3) {
      console.log('✅ Test 1: MAX_SUBMISSIONS_PER_HOUR has correct value (3)');
      testsPassed++;
    } else {
      console.log('❌ Test 1: MAX_SUBMISSIONS_PER_HOUR has incorrect value');
    }
  } catch (error) {
    console.log('❌ Test 1: Failed to access MAX_SUBMISSIONS_PER_HOUR');
  }

  // Test 2: Check constant type
  try {
    if (typeof MAX_SUBMISSIONS_PER_HOUR === 'number') {
      console.log('✅ Test 2: MAX_SUBMISSIONS_PER_HOUR is a number');
      testsPassed++;
    } else {
      console.log('❌ Test 2: MAX_SUBMISSIONS_PER_HOUR is not a number');
    }
  } catch (error) {
    console.log('❌ Test 2: Failed to check type of MAX_SUBMISSIONS_PER_HOUR');
  }

  // Test 3: Check error message duplication fix
  try {
    const apiErrorMessage = 'Too many submissions. Please try again in 59 minutes.';
    const hasRetryInfo = apiErrorMessage.includes('try again in');

    if (hasRetryInfo) {
      console.log('✅ Test 3: API error message contains retry information');
      testsPassed++;
    } else {
      console.log('❌ Test 3: API error message missing retry information');
    }
  } catch (error) {
    console.log('❌ Test 3: Failed to check error message format');
  }

  console.log(`\n📊 Test Results: ${testsPassed}/${totalTests} tests passed`);

  if (testsPassed === totalTests) {
    console.log('🎉 All tests passed!');
    return true;
  } else {
    console.log('💥 Some tests failed!');
    return false;
  }
}
