import { validateHoneypot, validateFormTiming, validatePhoneNumber, validateLinkSpam } from '../../src/lib/validation/security-validators'
import { ContactFormData } from '../../src/lib/validation/contact-schema'

describe('Security Validators', () => {
  describe('validateHoneypot', () => {
    it('passes when honeypot field is empty', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Test message',
        website: '' // Honeypot field
      }

      const result = validateHoneypot(data, '192.168.1.1')
      expect(result.isValid).toBe(true)
    })

    it('fails when honeypot field is filled', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Test message',
        website: 'spam-bot-filled-this' // Honeypot field filled
      }

      const result = validateHoneypot(data, '192.168.1.1')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('honeypot')
    })
  })

  describe('validateFormTiming', () => {
    it('passes when form submission is not too fast', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Test message',
        website: ''
      }

      // Simulate a reasonable submission time (5 seconds)
      const startTime = Date.now() - 5000

      const result = validateFormTiming(data, '192.168.1.1', startTime)
      expect(result.isValid).toBe(true)
    })

    it('fails when form submission is too fast', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Test message',
        website: ''
      }

      // Simulate a very fast submission (1 second)
      const startTime = Date.now() - 1000

      const result = validateFormTiming(data, '192.168.1.1', startTime)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('too fast')
    })

    it('fails when form submission is too slow', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Test message',
        website: ''
      }

      // Simulate a very slow submission (1 hour)
      const startTime = Date.now() - 3600000

      const result = validateFormTiming(data, '192.168.1.1', startTime)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('too slow')
    })
  })

  describe('validatePhoneNumber', () => {
    it('passes with valid phone number', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Test message',
        website: ''
      }

      const result = validatePhoneNumber(data)
      expect(result.isValid).toBe(true)
    })

    it('passes with empty phone number', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        subject: 'Test Project',
        message: 'Test message',
        website: ''
      }

      const result = validatePhoneNumber(data)
      expect(result.isValid).toBe(true)
    })

    it('fails with invalid phone number', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: 'invalid-phone',
        subject: 'Test Project',
        message: 'Test message',
        website: ''
      }

      const result = validatePhoneNumber(data)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('phone number')
    })

    it('fails with phone number that is too short', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123',
        subject: 'Test Project',
        message: 'Test message',
        website: ''
      }

      const result = validatePhoneNumber(data)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('phone number')
    })
  })

  describe('validateLinkSpam', () => {
    it('passes with message containing no links', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'This is a normal message without any links.',
        website: ''
      }

      const result = validateLinkSpam(data, '192.168.1.1')
      expect(result.isValid).toBe(true)
    })

    it('passes with message containing one link', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Check out our website at https://example.com',
        website: ''
      }

      const result = validateLinkSpam(data, '192.168.1.1')
      expect(result.isValid).toBe(true)
    })

    it('passes with message containing two links', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Check out https://example.com and http://test.com',
        website: ''
      }

      const result = validateLinkSpam(data, '192.168.1.1')
      expect(result.isValid).toBe(true)
    })

    it('fails with message containing too many links', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Check out https://example.com, http://test.com, and https://spam.com',
        website: ''
      }

      const result = validateLinkSpam(data, '192.168.1.1')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('too many links')
    })

    it('handles various link formats', () => {
      const data: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Links: https://example.com, http://test.com, ftp://files.com',
        website: ''
      }

      const result = validateLinkSpam(data, '192.168.1.1')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('too many links')
    })
  })
}) 