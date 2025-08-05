export interface CacheMetricsInterface {
  recordCacheHit(cacheType: string, method: string): void;
  recordCacheMiss(cacheType: string, method: string): void;
  setCacheSize(cacheType: string, size: number): void;
  withDuration<T>(method: string, fn: () => Promise<T>): Promise<T>;
  clearAllMetrics(): void;
}
