import { logger } from '@/lib/utils/logger';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/lib/env';

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
  if (!path || path === '/placeholder.svg' || path === fallbackUrl) {
    return fallbackUrl;
  }

  try {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    
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

    return signedUrl;
  } catch (error) {
    logger.error('Error generating presigned URL:', error);
    return fallbackUrl;
  }
}
