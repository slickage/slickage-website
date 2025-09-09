import { z } from 'zod';
import { logger } from '@/lib/logger';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/env';

const s3ImagePathSchema = z
  .string()
  .min(1, 'Path cannot be empty')
  .max(500, 'Path too long')
  .regex(/^[a-zA-Z0-9\/\-_\.]+$/, 'Invalid characters in path')
  .refine(
    (path) => !path.includes('..'),
    'Path traversal not allowed'
  )
  .refine(
    (path) => {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      return allowedExtensions.some(ext => 
        path.toLowerCase().endsWith(ext)
      );
    },
    'Invalid file extension'
  );

const getS3ImageUrlSchema = z.object({
  path: s3ImagePathSchema,
  fallbackUrl: z.string().startsWith('/').default('/placeholder.svg')
});

/**
 * Gets a presigned S3 URL for an image path with enhanced caching
 * @param path - The image path within the S3 bucket
 * @param fallbackUrl - Optional fallback URL (defaults to '/placeholder.svg')
 * @returns Promise that resolves to the presigned URL or fallback URL
 */
export async function getS3ImageUrl(
  path: string,
  fallbackUrl: string = '/placeholder.svg',
): Promise<string> {
  try {
    const validated = getS3ImageUrlSchema.parse({ path, fallbackUrl });
    
    if (validated.path === '/placeholder.svg' || validated.path === validated.fallbackUrl) {
      return validated.fallbackUrl;
    }

    const normalizedPath = validated.path.startsWith('/') ? validated.path.slice(1) : validated.path;
    
    const s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: normalizedPath,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    logger.info('Generated presigned URL', { 
      path: normalizedPath, 
      expiresIn: '1h',
      timestamp: new Date().toISOString()
    });

    return signedUrl;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      logger.warn('Invalid S3 image path:', { 
        path, 
        errors: details,
        fallbackUrl 
      });
      return fallbackUrl;
    }

    logger.error('Error generating presigned URL:', { 
      path, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return fallbackUrl;
  }
}
