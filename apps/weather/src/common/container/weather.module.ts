import {
  CacheInterface,
  GeocodingInterface,
  HttpClientInterface,
  LoggerInterface,
} from '@weather-app/libs';

import { WeatherData } from '../../core/weather.interface';
import { LoggingWeatherProviderDecorator } from '../../infrastructure/decorators/providers-logging.decorator';
import { OpenMeteoProviderService } from '../../infrastructure/providers/open-meteo.provider';
import { WeatherApiProviderService } from '../../infrastructure/providers/weather-api.provider';
import { WeatherProviderChain } from '../../infrastructure/providers/weather.provider';
import { WeatherCacheProxyService } from '../../infrastructure/proxy/weather-cache-proxy.service';
import { WeatherApiConfig } from '../config/weather-api.config';

export class WeatherModule {
  public readonly weatherService: WeatherCacheProxyService;

  constructor(
    private readonly weatherApiConfig: WeatherApiConfig,
    private readonly httpClient: HttpClientInterface,
    private readonly geocodingService: GeocodingInterface,
    private readonly weatherCache: CacheInterface<WeatherData>,
    private readonly logger: LoggerInterface,
  ) {
    const openMeteoProvider = new LoggingWeatherProviderDecorator(
      new OpenMeteoProviderService(
        this.httpClient,
        this.weatherApiConfig,
        this.geocodingService,
      ),
      this.logger,
      'OpenMeteoProvider',
    );

    const weatherApiProvider = new LoggingWeatherProviderDecorator(
      new WeatherApiProviderService(this.httpClient, this.weatherApiConfig),
      this.logger,
      'WeatherApiProvider',
    );

    const weatherProviderChain = new WeatherProviderChain([
      weatherApiProvider,
      openMeteoProvider,
    ]);

    this.weatherService = new WeatherCacheProxyService(
      weatherProviderChain,
      this.weatherCache,
    );
  }
}
