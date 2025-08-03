import { CacheInterface } from '../../../core/cache/cache.interface';
import { LoggerInterface } from '../../../core/logger/logger.interface';
import { LoggingDecoratorBase } from '../../../infrastructure/logger/logger.abstract';

export class LoggingCacheDecorator<T>
  extends LoggingDecoratorBase<CacheInterface<T>>
  implements CacheInterface<T>
{
  constructor(
    wrapped: CacheInterface<T>,
    logger: LoggerInterface,
    context: string,
  ) {
    super(wrapped, logger, context);
  }

  async get(key: string): Promise<T | null> {
    const result = await this.wrapped.get(key);
    this.logDebug('cache_get', { key }, result ? 'hit' : 'miss');
    return result;
  }

  async set(key: string, value: T): Promise<void> {
    await this.wrapped.set(key, value);
    this.logDebug('cache_set', { key }, 'stored');
  }

  async getOrCompute(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = await this.get(key);
    if (cached) {
      this.logDebug('cache_getOrCompute', { key }, 'hit');
      return cached;
    }
    const data = await fetchFn();
    await this.set(key, data);
    this.logDebug('cache_getOrCompute', { key }, 'computed');
    return data;
  }
}
