import { NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/lib/env';
import { logger } from '@/lib/utils/logger';

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const dynamic = 'force-dynamic';

// Cache presigned URLs for 30 minutes (less than the 1-hour expiration)
export const revalidate = 1800; // 30 minutes in seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'No key provided' }, { status: 400 });
    }

    const bucketName = env.S3_BUCKET_NAME;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ url });
  } catch (error) {
    logger.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
  }
}
