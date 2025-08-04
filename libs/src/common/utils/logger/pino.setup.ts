import { Logger, pino } from 'pino';

import { LoggerConfig } from '../../../common/config/logger.config';

type TransportTarget = {
  target: string;
  options?: Record<string, unknown>;
  level: string;
};

export function createPinoLogger(config: LoggerConfig): Logger {
  const targets: TransportTarget[] = [];

  targets.push({
    target: 'pino/file',
    options: {
      destination: config.filePath,
    },
    level: config.level,
  });

  if (config.pretty) {
    targets.push({
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
      },
      level: config.level,
    });
  }

  if (config.lokiHost) {
    targets.push({
      target: 'pino-loki',
      options: {
        host: config.lokiHost,
        labels: {
          app: config.appName,
          version: config.version,
        },
        json: true,
      },
      level: config.lokiLevel,
    });
  }

  return pino({
    level: config.level,
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
      targets,
    },
  });
}
