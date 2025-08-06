import { Redis } from 'ioredis';

import { RedisConfig } from '../../../common/config/redis.config';
import { LoggerInterface } from '../../../core/logger/logger.interface';

export class RedisClient {
  public readonly client: Redis;

  constructor(
    config: RedisConfig,
    private readonly logger: LoggerInterface,
  ) {
    this.client = new Redis({
      host: config.host,
      port: config.port,
    });

    this.client.on('error', (err: unknown) => {
      this.logger.error({ msg: 'Redis error', error: err });
      process.exit(1);
    });
  }

  disconnect(): void {
    this.logger.info({ msg: 'Disconnecting Redis client' });
    this.client.disconnect();
  }
}
