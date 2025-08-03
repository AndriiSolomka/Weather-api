import {
  CacheInterface,
  CacheRepositoryInterface,
  CacheService,
  LoggerInterface,
  LoggingCacheDecorator,
  RedisClient,
  RedisRepository,
} from '@weather-app/libs';

import { CacheMetricsInterface } from '../../core/cache-metrics.interface';
import { WeatherData } from '../../core/weather.interface';
import { MetricsCacheDecorator } from '../../infrastructure/decorators/metrics-cache.decorator';
import { CacheConfig } from '../config/cache.cnfig';

export class CacheModule {
  public readonly redisRepository: CacheRepositoryInterface;
  public readonly weatherCache: CacheInterface<WeatherData>;

  constructor(
    private readonly cacheConfig: CacheConfig,
    private readonly redisClient: RedisClient,
    private readonly logger: LoggerInterface,
    private readonly cacheMetrics: CacheMetricsInterface,
  ) {
    this.redisRepository = new RedisRepository(this.redisClient.client);

    const baseCache = new CacheService<WeatherData>(
      this.redisRepository,
      this.cacheConfig.weatherCachePrefix,
      this.cacheConfig.weatherCacheTTL,
    );

    const metricsCache = new MetricsCacheDecorator<WeatherData>(
      baseCache,
      this.cacheMetrics,
      'WeatherCacheMetrics',
    );

    this.weatherCache = new LoggingCacheDecorator(
      metricsCache,
      this.logger,
      'WeatherCache',
    );
  }
}
