import { Redis } from 'ioredis';

import { CacheRepositoryInterface } from '../../../core/cache/cache-repository.interface';

export class RedisRepository implements CacheRepositoryInterface {
  constructor(private readonly redisClient: Redis) {}

  async get(prefix: string, key: string): Promise<string | null> {
    return await this.redisClient.get(`${prefix}:${key}`);
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value);
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  }

  disconnect(): void {
    this.redisClient.disconnect();
  }
}
