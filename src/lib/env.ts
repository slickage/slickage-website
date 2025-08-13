/**
 * Server-side environment variables
 * Based on Next.js best practices: https://nextjs.org/docs/app/guides/environment-variables
 */

type ServerEnv = {
  S3_BUCKET_URL: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  RECAPTCHA_SITE_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
  DATABASE_URL: string;
  SLACK_WEBHOOK_URL?: string;
  NODE_ENV: string;
  REDIS_URL?: string;
};

function getServerEnv(): ServerEnv {
  // Return empty values on client-side
  if (typeof window !== 'undefined') {
    return {
      S3_BUCKET_URL: '',
      AWS_ACCESS_KEY_ID: '',
      AWS_SECRET_ACCESS_KEY: '',
      AWS_REGION: '',
      RECAPTCHA_SITE_KEY: '',
      RECAPTCHA_SECRET_KEY: '',
      DATABASE_URL: '',
      SLACK_WEBHOOK_URL: '',
      NODE_ENV: process.env.NODE_ENV || 'production',
      REDIS_URL: '',
    };
  }

  // Only validate at runtime, not during build
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
    const requiredVars = [
      'S3_BUCKET_URL',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_REGION',
      'RECAPTCHA_SITE_KEY',
      'RECAPTCHA_SECRET_KEY',
      'DATABASE_URL',
    ];

    const missingVars = requiredVars.filter(
      (key) => !process.env[key] && !process.env[`NETLIFY_${key}`],
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required server environment variables: ${missingVars.join(', ')}\n` +
          'Please check your .env file and ensure all required variables are set.',
      );
    }
  }

  return {
    S3_BUCKET_URL: process.env.S3_BUCKET_URL || '',
    AWS_ACCESS_KEY_ID: process.env.NETLIFY_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY:
      process.env.NETLIFY_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_REGION: process.env.NETLIFY_AWS_REGION || process.env.AWS_REGION || 'us-west-2',
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || '',
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '',
    DATABASE_URL: process.env.DATABASE_URL || '',
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL || '',
    NODE_ENV: process.env.NODE_ENV || 'production',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  };
}

let envInstance: ServerEnv | null = null;

export const env: ServerEnv = new Proxy({} as ServerEnv, {
  get(_target, prop) {
    if (!envInstance) {
      envInstance = getServerEnv();
    }
    return envInstance[prop as keyof ServerEnv];
  },
});
