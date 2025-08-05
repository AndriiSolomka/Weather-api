import { CacheInterface } from '@weather-app/libs';

import { CacheMetricsInterface } from '../../core/cache-metrics.interface';

export class MetricsCacheDecorator<T> {
  constructor(
    private readonly decorated: CacheInterface<T>,
    private readonly metrics: CacheMetricsInterface,
  ) {}

  async get(key: string): Promise<T | null> {
    return this.metrics.withDuration('get', () => this.decorated.get(key));
  }

  async set(key: string, value: T): Promise<void> {
    return this.metrics.withDuration('set', () =>
      this.decorated.set(key, value),
    );
  }

  async getOrCompute(key: string, fetchFn: () => Promise<T>): Promise<T> {
    return this.metrics.withDuration('getOrCompute', () =>
      this.decorated.getOrCompute(key, fetchFn),
    );
  }
}
