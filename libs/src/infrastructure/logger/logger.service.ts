import { Logger } from 'pino';

import { LoggerConfig } from '../../common/config/logger.config';
import { createPinoLogger } from '../../common/utils/logger/pino.setup';
import { LoggerInterface } from '../../core/logger/logger.interface';

export class LoggerService implements LoggerInterface {
  private readonly logger: Logger | null;

  constructor(private readonly config: LoggerConfig) {
    this.logger = config.enableLogging ? createPinoLogger(config) : null;
  }

  info(data: Record<string, unknown>): void {
    this.logger?.info(data);
  }

  error(data: Record<string, unknown>): void {
    this.logger?.error(data);
  }

  warn(data: Record<string, unknown>): void {
    this.logger?.warn(data);
  }

  debug(data: Record<string, unknown>): void {
    if (!this.config.enableDebugLogging) return;
    this.logger?.debug(data);
  }

  trace(data: Record<string, unknown>): void {
    this.logger?.trace(data);
  }
}
