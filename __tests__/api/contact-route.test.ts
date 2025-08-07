import { POST, GET } from '../../src/app/api/contact/route'
import { NextRequest } from 'next/server'

// Mock the contact service
jest.mock('../../src/lib/services/contact-service', () => ({
  saveContactSubmission: jest.fn().mockResolvedValue({
    success: true,
    submissionId: 'test-id'
  })
}))

// Mock the security validators
jest.mock('../../src/lib/validation/security-validators', () => ({
  validateHoneypot: jest.fn().mockReturnValue({ isValid: true }),
  validateFormTiming: jest.fn().mockReturnValue({ isValid: true }),
  validatePhoneNumber: jest.fn().mockReturnValue({ isValid: true }),
  validateLinkSpam: jest.fn().mockReturnValue({ isValid: true })
}))

// Mock the rate limiter
jest.mock('../../src/lib/security/rate-limiter', () => ({
  checkRateLimit: jest.fn().mockReturnValue({ limited: false, remaining: 10 })
}))

// Mock the reCAPTCHA
jest.mock('../../src/lib/security/recaptcha', () => ({
  verifyRecaptcha: jest.fn().mockResolvedValue({ success: true, score: 0.8 }),
  validateRecaptchaScore: jest.fn().mockReturnValue(true)
}))

describe('Contact API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('handles valid contact submission', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('phone', '(555) 123-4567')
      formData.append('subject', 'Test Project')
      formData.append('message', 'This is a test message')
      formData.append('website', '') // Honeypot field
      formData.append('recaptchaToken', 'mock-token')

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: formData,
        headers: {
          'x-forwarded-for': '192.168.1.1'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.submissionId).toBe('test-id')
    })

    it('handles missing required fields', async () => {
      const formData = new FormData()
      formData.append('name', '')
      formData.append('email', 'invalid-email')
      formData.append('subject', '')
      formData.append('message', '')
      formData.append('website', '')
      formData.append('recaptchaToken', 'mock-token')

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: formData,
        headers: {
          'x-forwarded-for': '192.168.1.1'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('validation')
    })

    it('handles rate limiting', async () => {
      const { checkRateLimit } = require('../../src/lib/security/rate-limiter')
      checkRateLimit.mockReturnValue({ limited: true, remaining: 0 })

      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('subject', 'Test Project')
      formData.append('message', 'Test message')
      formData.append('website', '')
      formData.append('recaptchaToken', 'mock-token')

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: formData,
        headers: {
          'x-forwarded-for': '192.168.1.1'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.success).toBe(false)
      expect(data.error).toContain('rate limit')
    })

    it('handles honeypot detection', async () => {
      const { validateHoneypot } = require('../../src/lib/validation/security-validators')
      validateHoneypot.mockReturnValue({ isValid: false, error: 'Honeypot detected' })

      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('subject', 'Test Project')
      formData.append('message', 'Test message')
      formData.append('website', 'spam-bot-filled-this')
      formData.append('recaptchaToken', 'mock-token')

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: formData,
        headers: {
          'x-forwarded-for': '192.168.1.1'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('honeypot')
    })

    it('handles reCAPTCHA failure', async () => {
      const { verifyRecaptcha } = require('../../src/lib/security/recaptcha')
      verifyRecaptcha.mockResolvedValue({ success: false, score: 0.1 })

      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('subject', 'Test Project')
      formData.append('message', 'Test message')
      formData.append('website', '')
      formData.append('recaptchaToken', 'invalid-token')

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: formData,
        headers: {
          'x-forwarded-for': '192.168.1.1'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('reCAPTCHA')
    })
  })

  describe('GET', () => {
    it('returns method not allowed', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'GET'
      })

      const response = await GET(request)

      expect(response.status).toBe(405)
    })
  })
}) 