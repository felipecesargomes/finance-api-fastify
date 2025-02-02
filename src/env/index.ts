import { config } from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Escolhe o arquivo de ambiente com base em NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
config({ path: path.resolve(process.cwd(), envFile) });

const envSchema = z.object({
  DATABASE_URL: z.string({ required_error: 'DATABASE_URL is required' }),
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production')
});

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables.');
}

export const env = _env.data;