import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(), // Supabase direct connection (bypasses PgBouncer) for migrations

  // Redis
  REDIS_URL: z.string(),

  // S3 / Supabase Storage
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().default('clutch-uploads'),
  S3_TRAJECTORIES_BUCKET: z.string().default('clutch-trajectories'),
  S3_ENDPOINT: z.string(),

  // Auth — custom JWT (local dev) or Supabase Auth (production)
  JWT_SECRET: z.string().min(16).optional(),
  JWT_REFRESH_SECRET: z.string().min(16).optional(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  SUPABASE_JWT_SECRET: z.string().min(16).optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Server
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:8080'),
  WORKER_SECRET: z.string().min(8),
}).refine(
  (data) => data.JWT_SECRET || data.SUPABASE_JWT_SECRET,
  { message: 'Either JWT_SECRET (local dev) or SUPABASE_JWT_SECRET (production) must be set' }
);

function loadEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:');
    if ('fieldErrors' in result.error.flatten()) {
      console.error(result.error.flatten().fieldErrors);
    } else {
      console.error(result.error.issues);
    }
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
export type Env = z.infer<typeof envSchema>;
