import { z } from 'zod';

export const LoggerConfigSchema = z.object({
  enableLogging: z.coerce.boolean().optional().default(false),
  enableDebugLogging: z.coerce.boolean().optional().default(false),
  filePath: z.string().min(1, 'LOG_FILE_PATH is required'),
  pretty: z.coerce.boolean().optional().default(false),
  level: z.string().optional().default('trace'),
});

export type LoggerConfig = z.infer<typeof LoggerConfigSchema>;
