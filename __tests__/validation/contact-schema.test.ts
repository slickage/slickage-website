import { contactSchema } from '../../src/lib/validation/contact-schema'

describe('Contact Schema Validation', () => {
  describe('Valid data', () => {
    it('validates correct contact data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'This is a test message',
        website: ''
      }

      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('validates data without phone number', () => {
      const validData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '',
        subject: 'Another Project',
        message: 'Another test message',
        website: ''
      }

      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Invalid data', () => {
    it('rejects missing name', () => {
      const invalidData = {
        name: '',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'This is a test message',
        website: ''
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name')
      }
    })

    it('rejects invalid email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'This is a test message',
        website: ''
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email')
      }
    })

    it('rejects missing subject', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: '',
        message: 'This is a test message',
        website: ''
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('subject')
      }
    })

    it('rejects missing message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: '',
        website: ''
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message')
      }
    })

    it('rejects message that is too short', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Hi',
        website: ''
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message')
      }
    })

    it('rejects message that is too long', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'A'.repeat(2001), // Too long
        website: ''
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('message')
      }
    })

    it('rejects invalid phone number format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: 'invalid-phone',
        subject: 'Test Project',
        message: 'This is a test message',
        website: ''
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('phone')
      }
    })

    it('rejects name that is too long', () => {
      const invalidData = {
        name: 'A'.repeat(101), // Too long
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'This is a test message',
        website: ''
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name')
      }
    })

    it('rejects subject that is too long', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'A'.repeat(101), // Too long
        message: 'This is a test message',
        website: ''
      }

      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('subject')
      }
    })
  })

  describe('Edge cases', () => {
    it('handles minimum valid message length', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'Hi there!', // Minimum length
        website: ''
      }

      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('handles maximum valid message length', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Project',
        message: 'A'.repeat(2000), // Maximum length
        website: ''
      }

      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('handles various email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com'
      ]

      validEmails.forEach(email => {
        const validData = {
          name: 'John Doe',
          email,
          phone: '(555) 123-4567',
          subject: 'Test Project',
          message: 'This is a test message',
          website: ''
        }

        const result = contactSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })
  })
}) 