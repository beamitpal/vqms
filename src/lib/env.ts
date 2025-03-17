import { z } from 'zod';
import { EnvSchemaType } from './types';
const envSchema = z.object({
  NEXT_APP_EMAIL_HOST: z.string().min(1, 'EMAIL_HOST is required'),
  NEXT_APP_EMAIL_PORT: z.coerce.number().positive('EMAIL_PORT must be a positive number'),
  NEXT_APP_EMAIL_SECURE: z.enum(['true', 'false']).transform((val) => val === 'true'),
  NEXT_APP_EMAIL_USER: z.string().min(1, 'EMAIL_USER is required'),
  NEXT_APP_EMAIL_PASS: z.string().min(1, 'EMAIL_PASS is required'),
  NEXT_APP_EMAIL_FROM: z.string().email('EMAIL_FROM must be a valid email'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

export const env: EnvSchemaType = parsedEnv.data;
