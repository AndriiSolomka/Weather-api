import { Counter, Gauge, Histogram, Registry } from 'prom-client';

import { createCacheMetricCollectors } from './cache.metrics.factory';
import { CacheMetricsInterface } from '../../core/cache-metrics.interface';

export class CacheMetrics implements CacheMetricsInterface {
  private readonly cacheHitCounter: Counter<string>;
  private readonly cacheMissCounter: Counter<string>;
  private readonly cacheSize: Gauge<string>;
  private readonly cacheOperationDuration: Histogram<string>;

  constructor(private readonly registry: Registry) {
    const {
      cacheHitCounter,
      cacheMissCounter,
      cacheSize,
      cacheOperationDuration,
    } = createCacheMetricCollectors(registry);

    this.cacheHitCounter = cacheHitCounter;
    this.cacheMissCounter = cacheMissCounter;
    this.cacheSize = cacheSize;
    this.cacheOperationDuration = cacheOperationDuration;
  }

  recordCacheHit(cacheType: string, method: string): void {
    this.cacheHitCounter.inc({ cache_type: cacheType, method });
  }

  recordCacheMiss(cacheType: string, method: string): void {
    this.cacheMissCounter.inc({ cache_type: cacheType, method });
  }

  setCacheSize(cacheType: string, size: number): void {
    this.cacheSize.set({ cache_type: cacheType }, size);
  }

  createCacheOperationStopper(cacheType: string, operation: string) {
    const stopTimer = this.cacheOperationDuration.startTimer();
    return (status: string) => {
      stopTimer({ cache_type: cacheType, operation, status });
    };
  }

  clearAllMetrics(): void {
    this.cacheHitCounter.reset();
    this.cacheMissCounter.reset();
    this.cacheSize.reset();
    this.cacheOperationDuration.reset();
  }
}
