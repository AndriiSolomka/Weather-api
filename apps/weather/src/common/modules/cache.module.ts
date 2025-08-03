import {
  CacheInterface,
  CacheRepositoryInterface,
  CacheService,
  LoggingCacheDecorator,
  RedisRepository,
} from '@weather-app/libs';

import { Container } from '../../container';
import { WeatherData } from '../../core/weather.interface';
import { MetricsCacheDecorator } from '../../infrastructure/decorators/metrics-cache.decorator';

export class CacheModule {
  public readonly redisRepository: CacheRepositoryInterface;
  public readonly weatherCache: CacheInterface<WeatherData>;

  constructor({ infrastructureModule, config }: Container) {
    this.redisRepository = new RedisRepository(
      infrastructureModule.redisClient.client,
    );

    const baseCache = new CacheService<WeatherData>(
      this.redisRepository,
      config.cache.weatherCachePrefix,
      config.cache.weatherCacheTTL,
    );

    const metricsCache = new MetricsCacheDecorator<WeatherData>(
      baseCache,
      infrastructureModule.cacheMetrics,
      'WeatherCacheMetrics',
    );

    this.weatherCache = new LoggingCacheDecorator(
      metricsCache,
      infrastructureModule.logger,
      'WeatherCache',
    );
  }
}
