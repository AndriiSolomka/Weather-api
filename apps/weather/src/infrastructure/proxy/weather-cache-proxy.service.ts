import { CacheInterface } from '@weather-app/libs';

import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { WeatherData, WeatherInterface } from '../../core/weather.interface';

export class WeatherCacheProxyService implements WeatherInterface {
  constructor(
    private readonly weatherProvider: WeatherProviderInterface,
    private readonly cache: CacheInterface<WeatherData>,
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    return this.cache.getOrCompute(city, () =>
      this.weatherProvider.getWeather(city),
    );
  }
}
