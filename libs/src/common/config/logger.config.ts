import { z } from 'zod';

export const LoggerConfigSchema = z.object({
  enableLogging: z.coerce.boolean().optional().default(false),
  enableDebugLogging: z.coerce.boolean().optional().default(false),
  filePath: z.string().min(1),
  pretty: z.coerce.boolean().optional().default(false),
  level: z.string().optional().default('info'),
  lokiHost: z.url(),
  lokiLevel: z.string().optional().default('info'),
  appName: z.string().min(1),
  version: z.string().min(1).optional(),
});

export type LoggerConfig = z.infer<typeof LoggerConfigSchema>;
