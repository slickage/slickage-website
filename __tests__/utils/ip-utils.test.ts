import { getClientIp } from '../../src/lib/utils/ip-utils'
import { NextRequest } from 'next/server'

describe('IP Utils', () => {
  describe('getClientIp', () => {
    it('extracts IP from x-forwarded-for header', () => {
      const request = {
        headers: {
          get: (name: string) => {
            if (name === 'x-forwarded-for') return '192.168.1.1'
            return null
          }
        }
      } as NextRequest

      const result = getClientIp(request)
      expect(result).toBe('192.168.1.1')
    })

    it('extracts IP from x-real-ip header', () => {
      const request = {
        headers: {
          get: (name: string) => {
            if (name === 'x-real-ip') return '10.0.0.1'
            return null
          }
        }
      } as NextRequest

      const result = getClientIp(request)
      expect(result).toBe('10.0.0.1')
    })

    it('extracts IP from cf-connecting-ip header', () => {
      const request = {
        headers: {
          get: (name: string) => {
            if (name === 'cf-connecting-ip') return '172.16.0.1'
            return null
          }
        }
      } as NextRequest

      const result = getClientIp(request)
      expect(result).toBe('172.16.0.1')
    })

    it('handles multiple IPs in x-forwarded-for', () => {
      const request = {
        headers: {
          get: (name: string) => {
            if (name === 'x-forwarded-for') return '192.168.1.1, 10.0.0.1'
            return null
          }
        }
      } as NextRequest

      const result = getClientIp(request)
      expect(result).toBe('192.168.1.1')
    })

    it('returns unknown when no IP headers found', () => {
      const request = {
        headers: {
          get: (name: string) => null
        }
      } as NextRequest

      const result = getClientIp(request)
      expect(result).toBe('unknown')
    })

    it('prioritizes headers in correct order', () => {
      const request = {
        headers: {
          get: (name: string) => {
            if (name === 'x-forwarded-for') return '192.168.1.1'
            if (name === 'x-real-ip') return '10.0.0.1'
            if (name === 'cf-connecting-ip') return '172.16.0.1'
            return null
          }
        }
      } as NextRequest

      const result = getClientIp(request)
      expect(result).toBe('192.168.1.1') // Should prioritize x-forwarded-for
    })
  })
}) 