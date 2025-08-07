import { getEnv } from '../../src/lib/env'

// Mock the environment
const originalEnv = process.env

describe('Environment Configuration', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('getEnv', () => {
    it('returns environment variables when all are set', () => {
      process.env.S3_BUCKET_URL = 'https://test-bucket.s3.amazonaws.com'
      process.env.AWS_ACCESS_KEY_ID = 'test-access-key'
      process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key'
      process.env.AWS_REGION = 'us-west-2'
      process.env.NODE_ENV = 'production'

      const env = getEnv()

      expect(env.S3_BUCKET_URL).toBe('https://test-bucket.s3.amazonaws.com')
      expect(env.AWS_ACCESS_KEY_ID).toBe('test-access-key')
      expect(env.AWS_SECRET_ACCESS_KEY).toBe('test-secret-key')
      expect(env.AWS_REGION).toBe('us-west-2')
      expect(env.NODE_ENV).toBe('production')
    })

    it('uses Netlify environment variables when available', () => {
      process.env.NETLIFY_AWS_ACCESS_KEY_ID = 'netlify-access-key'
      process.env.NETLIFY_AWS_SECRET_ACCESS_KEY = 'netlify-secret-key'
      process.env.NETLIFY_AWS_REGION = 'us-east-1'
      process.env.S3_BUCKET_URL = 'https://test-bucket.s3.amazonaws.com'

      const env = getEnv()

      expect(env.AWS_ACCESS_KEY_ID).toBe('netlify-access-key')
      expect(env.AWS_SECRET_ACCESS_KEY).toBe('netlify-secret-key')
      expect(env.AWS_REGION).toBe('us-east-1')
    })

    it('falls back to standard AWS variables when Netlify variables not set', () => {
      process.env.AWS_ACCESS_KEY_ID = 'standard-access-key'
      process.env.AWS_SECRET_ACCESS_KEY = 'standard-secret-key'
      process.env.AWS_REGION = 'us-west-2'
      process.env.S3_BUCKET_URL = 'https://test-bucket.s3.amazonaws.com'

      const env = getEnv()

      expect(env.AWS_ACCESS_KEY_ID).toBe('standard-access-key')
      expect(env.AWS_SECRET_ACCESS_KEY).toBe('standard-secret-key')
      expect(env.AWS_REGION).toBe('us-west-2')
    })

    it('uses default values when environment variables not set', () => {
      delete process.env.AWS_REGION
      delete process.env.NODE_ENV

      const env = getEnv()

      expect(env.AWS_REGION).toBe('us-west-2') // Default value
      expect(env.NODE_ENV).toBe('production') // Default value
    })

    it('handles empty environment variables', () => {
      process.env.S3_BUCKET_URL = ''
      process.env.AWS_ACCESS_KEY_ID = ''
      process.env.AWS_SECRET_ACCESS_KEY = ''

      const env = getEnv()

      expect(env.S3_BUCKET_URL).toBe('')
      expect(env.AWS_ACCESS_KEY_ID).toBe('')
      expect(env.AWS_SECRET_ACCESS_KEY).toBe('')
    })

    it('prioritizes Netlify variables over standard variables', () => {
      process.env.NETLIFY_AWS_ACCESS_KEY_ID = 'netlify-access-key'
      process.env.AWS_ACCESS_KEY_ID = 'standard-access-key'
      process.env.S3_BUCKET_URL = 'https://test-bucket.s3.amazonaws.com'

      const env = getEnv()

      expect(env.AWS_ACCESS_KEY_ID).toBe('netlify-access-key')
    })

    it('handles missing S3_BUCKET_URL', () => {
      delete process.env.S3_BUCKET_URL

      const env = getEnv()

      expect(env.S3_BUCKET_URL).toBe('')
    })

    it('handles missing AWS credentials', () => {
      delete process.env.AWS_ACCESS_KEY_ID
      delete process.env.AWS_SECRET_ACCESS_KEY
      delete process.env.NETLIFY_AWS_ACCESS_KEY_ID
      delete process.env.NETLIFY_AWS_SECRET_ACCESS_KEY

      const env = getEnv()

      expect(env.AWS_ACCESS_KEY_ID).toBe('')
      expect(env.AWS_SECRET_ACCESS_KEY).toBe('')
    })
  })
}) 