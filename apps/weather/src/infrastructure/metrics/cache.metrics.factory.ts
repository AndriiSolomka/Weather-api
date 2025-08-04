import { Counter, Gauge, Histogram } from 'prom-client';

import { CACHE_METRIC_NAMES } from './constants/metrics.constants';

export const createCacheMetricCollectors = () => {
  const cacheHitCounter = new Counter({
    name: CACHE_METRIC_NAMES.HIT_TOTAL,
    help: 'Total number of cache hits',
    labelNames: ['cache_type', 'method'],
  });

  const cacheMissCounter = new Counter({
    name: CACHE_METRIC_NAMES.MISS_TOTAL,
    help: 'Total number of cache misses',
    labelNames: ['cache_type', 'method'],
  });

  const cacheSize = new Gauge({
    name: CACHE_METRIC_NAMES.SIZE,
    help: 'Current number of keys in cache',
    labelNames: ['cache_type'],
  });

  const cacheOperationDuration = new Histogram({
    name: CACHE_METRIC_NAMES.OPERATION_DURATION_SECONDS,
    help: 'Duration of cache operations',
    labelNames: ['cache_type', 'operation', 'status'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5],
  });

  return {
    cacheHitCounter,
    cacheMissCounter,
    cacheSize,
    cacheOperationDuration,
  };
};
