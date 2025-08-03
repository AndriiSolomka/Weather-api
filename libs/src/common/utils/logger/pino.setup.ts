import * as fs from 'node:fs';
import * as path from 'node:path';
import { Logger, LoggerOptions, multistream, pino } from 'pino';

import { LoggerConfig } from '../../../common/config/logger.config';

export function createPinoLogger(
  config: LoggerConfig,
  options: LoggerOptions = {},
): Logger {
  const logDir = path.dirname(config.filePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const streams: Array<{ stream: NodeJS.WritableStream; level?: string }> = [
    {
      stream: fs.createWriteStream(config.filePath, { flags: 'a' }),
      level: 'trace',
    },
  ];

  if (config.pretty) {
    streams.push({
      stream: pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
        },
      }) as NodeJS.WritableStream,
      level: 'trace',
    });
  }

  return pino(
    {
      level: config.level ?? 'trace',
      timestamp: pino.stdTimeFunctions.isoTime,
      ...options,
    },
    multistream(streams),
  );
}
