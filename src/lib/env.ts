/**
 * Environment variables with Zod validation
 * Server vs client separation:
 *  - On the client, returns safe defaults (never exposes secrets)
 *  - On the server, parses and validates process.env
 */
import { z } from 'zod';

export type ServerEnv = {
  S3_BUCKET_NAME: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  RECAPTCHA_SITE_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'test' | 'production';
};

const ServerEnvSchema = z.object({
  S3_BUCKET_NAME: z.string().default(''),
  AWS_ACCESS_KEY_ID: z.string().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().default(''),
  AWS_REGION: z.string().default('us-west-2'),
  RECAPTCHA_SITE_KEY: z.string().default(''),
  RECAPTCHA_SECRET_KEY: z.string().default(''),
  DATABASE_URL: z.string().default(''),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default((process.env.NODE_ENV as 'development' | 'test' | 'production') || 'production'),
});

function getServerEnv(): ServerEnv {
  // Client-side: never expose secrets
  if (typeof window !== 'undefined') {
    return {
      S3_BUCKET_NAME: '',
      AWS_ACCESS_KEY_ID: '',
      AWS_SECRET_ACCESS_KEY: '',
      AWS_REGION: '',
      RECAPTCHA_SITE_KEY: '',
      RECAPTCHA_SECRET_KEY: '',
      DATABASE_URL: '',
      NODE_ENV: (process.env.NODE_ENV as ServerEnv['NODE_ENV']) || 'production',
    };
  }

  const parsed = ServerEnvSchema.parse(process.env);
  const isNextBuild = Boolean(process.env.NEXT_PHASE);

  if (parsed.NODE_ENV === 'production' && !isNextBuild) {
    const requiredKeys: Array<keyof ServerEnv> = [
      'S3_BUCKET_NAME',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_REGION',
      'RECAPTCHA_SITE_KEY',
      'RECAPTCHA_SECRET_KEY',
      'DATABASE_URL',
    ];

    const missing = requiredKeys.filter((key) => !parsed[key] || parsed[key].length === 0);
    if (missing.length > 0) {
      throw new Error(
        `Missing required server environment variables: ${missing.join(', ')}\n` +
          'Please check your environment configuration.',
      );
    }
  }

  return parsed;
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
