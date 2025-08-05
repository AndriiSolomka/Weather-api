import {
  CacheInterface,
  CacheRepositoryInterface,
  CacheService,
  RedisRepository,
} from '@weather-app/libs';

import { Container } from '../../container';
import { CacheMetricsInterface } from '../../core/cache-metrics.interface';
import { WeatherData } from '../../core/weather.interface';
import { MetricsCacheDecorator } from '../../infrastructure/decorators/metrics-cache.decorator';
import { CacheMetrics } from '../../infrastructure/metrics/cache.metrics';

export class CacheModule {
  public readonly redisRepository: CacheRepositoryInterface;
  public readonly weatherCache: CacheInterface<WeatherData>;
  public readonly cacheMetrics: CacheMetricsInterface;

  constructor({ infrastructureModule, config }: Container) {
    this.redisRepository = new RedisRepository(
      infrastructureModule.redisClient.client,
    );

    const baseCache = new CacheService<WeatherData>(
      infrastructureModule.logger,
      this.redisRepository,
      config.get.cache.weatherCachePrefix,
      config.get.cache.weatherCacheTTL,
    );

    this.cacheMetrics = new CacheMetrics();

    this.weatherCache = new MetricsCacheDecorator<WeatherData>(
      baseCache,
      this.cacheMetrics,
    );
  }
}
