/**
 * Test setup file - runs before all tests
 * Configures testing environment and global test utilities
 */

// Test environment is set by bunfig.toml [test.env] section

// Global test utilities
(global as any).testUtils = {
  // Wait for a specified time (useful for async operations)
  wait: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),

  // Generate random test data
  generateTestIp: () =>
    `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,

  // Generate random email for testing
  generateTestEmail: () => `test-${Date.now()}@example.com`,

  // Clean up test data
  cleanup: async () => {
    // Add any global cleanup logic here
    console.log('🧹 Global test cleanup completed');
  },
};

// Global test configuration
beforeAll(async () => {
  console.log('🚀 Test environment setup started');

  // Add any global setup logic here
  // e.g., database connections, Redis connections, etc.

  console.log('✅ Test environment setup completed');
});

// Global test cleanup
afterAll(async () => {
  console.log('🧹 Test environment cleanup started');

  // Add any global cleanup logic here
  await (global as any).testUtils.cleanup();

  console.log('✅ Test environment cleanup completed');
});

// Extend global types for test utilities
declare global {
  var testUtils: {
    wait: (ms: number) => Promise<void>;
    generateTestIp: () => string;
    generateTestEmail: () => string;
    cleanup: () => Promise<void>;
  };
}

// Export to make this file a module
export {};
