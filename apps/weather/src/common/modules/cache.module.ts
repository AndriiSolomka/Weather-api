import {
  CacheInterface,
  CacheRepositoryInterface,
  CacheService,
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
      infrastructureModule.logger,
      this.redisRepository,
      config.cache.weatherCachePrefix,
      config.cache.weatherCacheTTL,
    );

    this.weatherCache = new MetricsCacheDecorator<WeatherData>(
      baseCache,
      infrastructureModule.cacheMetrics,
      'WeatherCacheMetrics',
    );
  }
}
