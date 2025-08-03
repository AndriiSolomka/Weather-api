import { Container } from '../../container';
import { WeatherInterface } from '../../core/weather.interface';
import { LoggingWeatherProviderDecorator } from '../../infrastructure/decorators/providers-logging.decorator';
import { OpenMeteoProviderService } from '../../infrastructure/providers/open-meteo.provider';
import { WeatherApiProviderService } from '../../infrastructure/providers/weather-api.provider';
import { WeatherProviderChain } from '../../infrastructure/providers/weather.provider';
import { WeatherCacheProxyService } from '../../infrastructure/proxy/weather-cache-proxy.service';

export class WeatherModule {
  public readonly weatherService: WeatherInterface;

  constructor({ infrastructureModule, config, cacheModule }: Container) {
    const openMeteoProvider = new LoggingWeatherProviderDecorator(
      new OpenMeteoProviderService(
        infrastructureModule.httpClient,
        config.weatherApi,
        infrastructureModule.geocodingService,
      ),
      infrastructureModule.logger,
      'OpenMeteoProvider',
    );

    const weatherApiProvider = new LoggingWeatherProviderDecorator(
      new WeatherApiProviderService(
        infrastructureModule.httpClient,
        config.weatherApi,
      ),
      infrastructureModule.logger,
      'WeatherApiProvider',
    );

    const weatherProviderChain = new WeatherProviderChain([
      weatherApiProvider,
      openMeteoProvider,
    ]);

    this.weatherService = new WeatherCacheProxyService(
      weatherProviderChain,
      cacheModule.weatherCache,
    );
  }
}
