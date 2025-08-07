import { checkRateLimit } from '../../src/lib/security/rate-limiter'

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Clear any existing rate limit data
    jest.clearAllMocks()
  })

  describe('checkRateLimit', () => {
    it('allows first request from an IP', () => {
      const result = checkRateLimit('192.168.1.1')
      
      expect(result.limited).toBe(false)
      expect(result.remaining).toBeGreaterThan(0)
    })

    it('allows multiple requests within limit', () => {
      // Make several requests
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit('192.168.1.1')
        expect(result.limited).toBe(false)
      }
    })

    it('eventually limits requests from same IP', () => {
      // Make many requests to trigger rate limiting
      let limited = false
      let attempts = 0
      
      while (!limited && attempts < 100) {
        const result = checkRateLimit('192.168.1.1')
        limited = result.limited
        attempts++
      }
      
      expect(limited).toBe(true)
    })

    it('tracks different IPs separately', () => {
      // Make many requests from one IP to trigger limiting
      let limited = false
      let attempts = 0
      
      while (!limited && attempts < 100) {
        const result = checkRateLimit('192.168.1.1')
        limited = result.limited
        attempts++
      }
      
      // Different IP should not be limited
      const result2 = checkRateLimit('192.168.1.2')
      expect(result2.limited).toBe(false)
    })

    it('provides remaining requests count', () => {
      const result = checkRateLimit('192.168.1.1')
      
      expect(result.remaining).toBeGreaterThanOrEqual(0)
      expect(typeof result.remaining).toBe('number')
    })

    it('provides reset time', () => {
      const result = checkRateLimit('192.168.1.1')
      
      expect(result.resetTime).toBeGreaterThan(Date.now())
      expect(typeof result.resetTime).toBe('number')
    })

    it('handles empty IP address', () => {
      const result = checkRateLimit('')
      
      expect(result.limited).toBe(false)
      expect(result.remaining).toBeGreaterThan(0)
    })

    it('handles unknown IP address', () => {
      const result = checkRateLimit('unknown')
      
      expect(result.limited).toBe(false)
      expect(result.remaining).toBeGreaterThan(0)
    })

    it('maintains rate limit state across calls', () => {
      const ip = '192.168.1.1'
      
      // First call
      const result1 = checkRateLimit(ip)
      expect(result1.limited).toBe(false)
      
      // Second call should have fewer remaining requests
      const result2 = checkRateLimit(ip)
      expect(result2.remaining).toBeLessThanOrEqual(result1.remaining)
    })
  })
}) 