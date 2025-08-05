import {
  CacheRepositoryInterface,
  CacheService,
  LoggerInterface,
} from '@weather-app/libs';

import { CacheConfig } from '../../common/config/cache.config';
import { WeatherData } from '../../core/weather.interface';

export class CacheWeatherService extends CacheService<WeatherData> {
  constructor(
    logger: LoggerInterface,
    cache: CacheRepositoryInterface,
    private readonly config: CacheConfig,
  ) {
    super(logger, cache, config.weatherCachePrefix, config.weatherCacheTTL);
  }
}
