import { ContactFormData } from './contact-schema';
import { countLinks, isValidPhoneNumber } from '../utils/sanitizers';
import { logger } from '../utils/logger';

export const MIN_FORM_TIME = 3000; // minimum time to fill form (3 seconds)
export const MAX_LINKS_IN_MESSAGE = 2;

export interface SecurityValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Check honeypot field for spam
 */
export function validateHoneypot(data: ContactFormData, clientIp: string): SecurityValidationResult {
  if (data.website && data.website.trim() !== '') {
    logger.security(`Spam detected (honeypot): IP ${clientIp}`);
    return { isValid: false, error: 'Invalid submission' };
  }
  return { isValid: true };
}

/**
 * Check if form was submitted too quickly
 */
export function validateFormTiming(data: ContactFormData, clientIp: string): SecurityValidationResult {
  if (data.elapsed && data.elapsed < MIN_FORM_TIME) {
    logger.security(`Spam detected (too fast): IP ${clientIp}, elapsed ${data.elapsed}ms`);
    return { isValid: false, error: 'Please take more time to fill out the form' };
  }
  return { isValid: true };
}

/**
 * Validate phone number if provided
 */
export function validatePhoneNumber(data: ContactFormData): SecurityValidationResult {
  if (data.phone && data.phone.trim() !== '') {
    const digitsOnly = data.phone.replace(/\D/g, '');
    if (!isValidPhoneNumber(digitsOnly)) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }
  }
  return { isValid: true };
}

/**
 * Check for link spam in message
 */
export function validateLinkSpam(data: ContactFormData, clientIp: string): SecurityValidationResult {
  const linkCount = countLinks(data.message);
  if (linkCount > MAX_LINKS_IN_MESSAGE) {
    logger.security(`Spam detected (too many links): IP ${clientIp}, links ${linkCount}`);
    return { isValid: false, error: 'Message contains too many links' };
  }
  return { isValid: true };
}