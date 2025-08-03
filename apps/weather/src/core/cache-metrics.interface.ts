export interface CacheMetricsInterface {
  recordCacheHit(cacheType: string, method: string): void;
  recordCacheMiss(cacheType: string, method: string): void;
  setCacheSize(cacheType: string, size: number): void;

  createCacheOperationStopper(
    cacheType: string,
    operation: string,
  ): (status: string) => void;

  clearAllMetrics(): void;
}
