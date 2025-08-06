import { z } from 'zod';

export const CacheConfigSchema = z.object({
  weatherCachePrefix: z.string().nonempty().default('weather'),
  weatherCacheTTL: z.coerce.number().int().positive().default(600),
});

export type CacheConfig = z.infer<typeof CacheConfigSchema>;
