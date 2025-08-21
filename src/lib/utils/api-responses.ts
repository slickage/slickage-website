import { NextResponse } from 'next/server';
import { logger } from './logger';

export interface ErrorResponse {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  retryAfter?: number;
}

export interface SuccessResponse<T = any> {
  message: string;
  data?: T;
}

/**
 * Standardized error response utility
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: ErrorResponse['details'],
  retryAfter?: number,
): NextResponse {
  const errorResponse: ErrorResponse = { error: message };

  if (details) errorResponse.details = details;
  if (retryAfter) errorResponse.retryAfter = retryAfter;

  return NextResponse.json(errorResponse, {
    status,
    headers: retryAfter ? { 'Retry-After': retryAfter.toString() } : undefined,
  });
}

export function createSuccessResponse<T>(
  message: string,
  data?: T,
  status: number = 200,
  headers?: Record<string, string>,
): NextResponse {
  const response: SuccessResponse<T> = { message };
  if (data) response.data = data;

  return NextResponse.json(response, { status, headers });
}

export function createBadRequestResponse(
  message: string,
  details?: ErrorResponse['details'],
): NextResponse {
  return createErrorResponse(message, 400, details);
}

export function createUnauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return createErrorResponse(message, 401);
}

export function createForbiddenResponse(message: string = 'Forbidden'): NextResponse {
  return createErrorResponse(message, 403);
}

export function createNotFoundResponse(message: string = 'Not found'): NextResponse {
  return createErrorResponse(message, 404);
}

export function createRateLimitedResponse(message: string, retryAfter: number): NextResponse {
  return createErrorResponse(message, 429, undefined, retryAfter);
}

export function createServerErrorResponse(message: string = 'Internal server error'): NextResponse {
  return createErrorResponse(message, 500);
}

export function createServiceUnavailableResponse(
  message: string = 'Service temporarily unavailable',
): NextResponse {
  return createErrorResponse(message, 503);
}

/**
 * Standardized error handler for API routes
 */
export function handleApiError(error: unknown, context: string, startTime?: number): NextResponse {
  const processingTime = startTime ? Date.now() - startTime : 0;

  if (error instanceof Error) {
    logger.error(`${context}: processing time ${processingTime}ms`, {
      error: error.message,
      stack: error.stack,
    });

    // Handle specific error types
    if (error.message.includes('database') || error.message.includes('connection')) {
      return createServiceUnavailableResponse(
        'Service temporarily unavailable. Please try again later.',
      );
    }

    return createServerErrorResponse('Internal server error');
  }

  logger.error(`${context}: processing time ${processingTime}ms`, error);
  return createServerErrorResponse('Internal server error');
}
