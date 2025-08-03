import { z } from 'zod';

export const RedisConfigSchema = z.object({
  host: z.string().min(1, 'REDIS_HOST is required'),
  port: z.coerce.number().default(6379),
});

export type RedisConfig = z.infer<typeof RedisConfigSchema>;
