import { verifyRecaptcha, validateRecaptchaScore } from '../../src/lib/security/recaptcha'

// Mock fetch
global.fetch = jest.fn()

describe('reCAPTCHA', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('verifyRecaptcha', () => {
    it('verifies valid token successfully', async () => {
      const mockResponse = {
        success: true,
        score: 0.8,
        action: 'contact_form'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await verifyRecaptcha('valid-token')

      expect(result.success).toBe(true)
      expect(result.score).toBe(0.8)
      expect(result.error).toBeUndefined()
    })

    it('handles verification failure', async () => {
      const mockResponse = {
        success: false,
        'error-codes': ['invalid-input-secret']
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await verifyRecaptcha('invalid-token')

      expect(result.success).toBe(false)
      expect(result.score).toBe(0)
      expect(result.error).toBeDefined()
    })

    it('handles network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await verifyRecaptcha('valid-token')

      expect(result.success).toBe(false)
      expect(result.score).toBe(0)
      expect(result.error).toContain('Network error')
    })

    it('handles invalid response format', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'response' })
      })

      const result = await verifyRecaptcha('valid-token')

      expect(result.success).toBe(false)
      expect(result.score).toBe(0)
      expect(result.error).toBeDefined()
    })

    it('handles HTTP error responses', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      const result = await verifyRecaptcha('valid-token')

      expect(result.success).toBe(false)
      expect(result.score).toBe(0)
      expect(result.error).toContain('HTTP error')
    })

    it('handles empty token', async () => {
      const result = await verifyRecaptcha('')

      expect(result.success).toBe(false)
      expect(result.score).toBe(0)
      expect(result.error).toContain('Token is required')
    })
  })

  describe('validateRecaptchaScore', () => {
    it('passes high score with default threshold', () => {
      const result = validateRecaptchaScore(0.8)
      expect(result).toBe(true)
    })

    it('passes score equal to threshold', () => {
      const result = validateRecaptchaScore(0.5, 0.5)
      expect(result).toBe(true)
    })

    it('fails low score with default threshold', () => {
      const result = validateRecaptchaScore(0.3)
      expect(result).toBe(false)
    })

    it('fails score below custom threshold', () => {
      const result = validateRecaptchaScore(0.4, 0.7)
      expect(result).toBe(false)
    })

    it('passes score above custom threshold', () => {
      const result = validateRecaptchaScore(0.8, 0.7)
      expect(result).toBe(true)
    })

    it('handles edge case scores', () => {
      expect(validateRecaptchaScore(0.0)).toBe(false)
      expect(validateRecaptchaScore(1.0)).toBe(true)
      expect(validateRecaptchaScore(0.5)).toBe(true)
    })

    it('handles custom thresholds', () => {
      expect(validateRecaptchaScore(0.6, 0.6)).toBe(true)
      expect(validateRecaptchaScore(0.5, 0.6)).toBe(false)
      expect(validateRecaptchaScore(0.7, 0.6)).toBe(true)
    })
  })
}) 