interface CacheOperationTimer {
  stop(labels: { status: string }): void;
  [Symbol.dispose]?(): void;
}

export interface CacheMetricsInterface {
  recordCacheHit(cacheType: string, method: string): void;
  recordCacheMiss(cacheType: string, method: string): void;
  setCacheSize(cacheType: string, size: number): void;

  createCacheOperationStopper(
    cacheType: string,
    method: string,
  ): CacheOperationTimer;

  clearAllMetrics(): void;
}
