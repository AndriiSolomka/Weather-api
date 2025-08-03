import { CacheInterface } from '@weather-app/libs';

import { CacheMetricsInterface } from '../../core/cache-metrics.interface';
import { CACHE_OPERATION_STATUS } from '../metrics/constants/metrics.constants';

export class MetricsCacheDecorator<T> {
  constructor(
    private readonly decorated: CacheInterface<T>,
    private readonly metrics: CacheMetricsInterface,
    private readonly cacheType: string,
  ) {}

  async get(key: string): Promise<T | null> {
    const end = this.metrics.createCacheOperationStopper(this.cacheType, 'get');
    try {
      const result = await this.decorated.get(key);
      if (result !== null && result !== undefined) {
        this.metrics.recordCacheHit(this.cacheType, 'get');
      } else {
        this.metrics.recordCacheMiss(this.cacheType, 'get');
      }

      end(CACHE_OPERATION_STATUS.SUCCESS);
      return result;
    } catch (error) {
      end(CACHE_OPERATION_STATUS.ERROR);
      throw error;
    }
  }

  async set(key: string, value: T): Promise<void> {
    const end = this.metrics.createCacheOperationStopper(this.cacheType, 'set');
    try {
      await this.decorated.set(key, value);
      end(CACHE_OPERATION_STATUS.SUCCESS);
    } catch (error) {
      end(CACHE_OPERATION_STATUS.ERROR);
      throw error;
    }
  }

  async getOrCompute(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const end = this.metrics.createCacheOperationStopper(
      this.cacheType,
      'getOrCompute',
    );
    try {
      const result = await this.decorated.getOrCompute(key, fetchFn);
      end(CACHE_OPERATION_STATUS.SUCCESS);
      return result;
    } catch (error) {
      end(CACHE_OPERATION_STATUS.ERROR);
      throw error;
    }
  }
}
