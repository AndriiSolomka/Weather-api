import { CacheRepositoryInterface, CacheService } from '@weather-app/libs';

import { CacheConfig } from '../../common/config/cache.cnfig';
import { WeatherData } from '../../core/weather.interface';

export class CacheWeatherService extends CacheService<WeatherData> {
  constructor(
    cache: CacheRepositoryInterface,
    private readonly config: CacheConfig,
  ) {
    super(cache, config.weatherCachePrefix, config.weatherCacheTTL);
  }
}
