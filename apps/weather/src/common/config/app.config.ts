import { z } from 'zod';

export const AppConfigSchema = z.object({
  port: z.coerce.number().int().min(1).max(65535),
  host: z.string(),
  gracefulShutdownDelay: z.coerce.number().int().nonnegative(),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
