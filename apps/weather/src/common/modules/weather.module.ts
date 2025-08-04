import { Container } from '../../container';
import { WeatherInterface } from '../../core/weather.interface';
import { OpenMeteoProviderService } from '../../infrastructure/providers/open-meteo.provider';
import { WeatherApiProviderService } from '../../infrastructure/providers/weather-api.provider';
import { WeatherProviderChain } from '../../infrastructure/providers/weather.provider';
import { WeatherCacheProxyService } from '../../infrastructure/proxy/weather-cache-proxy.service';

export class WeatherModule {
  public readonly weatherService: WeatherInterface;

  constructor({ infrastructureModule, config, cacheModule }: Container) {
    const openMeteoProvider = new OpenMeteoProviderService(
      infrastructureModule.httpClient,
      config.weatherApi,
      infrastructureModule.geocodingService,
    );

    const weatherApiProvider = new WeatherApiProviderService(
      infrastructureModule.httpClient,
      config.weatherApi,
    );

    const weatherProviderChain = new WeatherProviderChain(
      infrastructureModule.logger,
      [weatherApiProvider, openMeteoProvider],
    );

    this.weatherService = new WeatherCacheProxyService(
      weatherProviderChain,
      cacheModule.weatherCache,
    );
  }
}
