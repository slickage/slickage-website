/**
 * Environment variable validation and type safety
 * Based on Next.js best practices: https://nextjs.org/docs/app/guides/environment-variables
 */

const requiredEnvVars = {
  S3_BUCKET_URL: process.env.S3_BUCKET_URL,
  AWS_ACCESS_KEY_ID: process.env.NETLIFY_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY:
    process.env.NETLIFY_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.NETLIFY_AWS_REGION || process.env.AWS_REGION,
} as const;

const optionalEnvVars = {
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

function validateEnv() {
  const missingVars: string[] = [];

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
        'Please check your .env file and ensure all required variables are set.',
    );
  }
}

validateEnv();

export const env = {
  ...requiredEnvVars,
  ...optionalEnvVars,
} as {
  S3_BUCKET_URL: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  NODE_ENV: string;
};

export { validateEnv };
