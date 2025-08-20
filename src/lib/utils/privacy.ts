import { createHash } from 'crypto';

/**
 * Privacy utilities for anonymizing sensitive data in analytics
 */

/**
 * Hash email address for privacy-compliant tracking
 * @param email The email address to hash
 * @returns SHA-256 hash of the email address
 */
export function hashEmail(email: string): string {
  return createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}

/**
 * Anonymize IP address by removing last octet
 * @param ip The IP address to anonymize
 * @returns Anonymized IP address
 */
export function anonymizeIp(ip: string): string {
  if (ip === 'unknown' || !ip) {
    return 'unknown';
  }

  // Handle IPv4
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }

  // Handle IPv6 (simplified - remove last segment)
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length > 1) {
      parts[parts.length - 1] = '0';
      return parts.join(':');
    }
  }

  return 'anonymized';
}

/**
 * Create a privacy-safe distinct ID from email
 * @param email The email address
 * @returns Hashed distinct ID for tracking
 */
export function createSafeDistinctId(email: string): string {
  const hashedEmail = hashEmail(email);
  return `lead_${hashedEmail.substring(0, 16)}`;
}

/**
 * Extract domain from email for company tracking
 * @param email The email address
 * @returns Domain part of the email
 */
export function extractEmailDomain(email: string): string {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain || 'unknown';
}
