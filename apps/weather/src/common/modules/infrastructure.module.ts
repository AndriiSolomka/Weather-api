import {
  GeocodingInterface,
  GeocodingService,
  HttpClient,
  HttpClientInterface,
  LoggerInterface,
  LoggerService,
  RedisClient,
} from '@weather-app/libs';

import { Container } from '../../container';

export class InfrastructureModule {
  public readonly logger: LoggerInterface;
  public readonly httpClient: HttpClientInterface;
  public readonly redisClient: RedisClient;
  public readonly geocodingService: GeocodingInterface;

  constructor({ config }: Container) {
    this.logger = new LoggerService(config.get.logger);

    this.httpClient = new HttpClient(this.logger);

    this.redisClient = new RedisClient(config.get.redis, this.logger);
    this.geocodingService = new GeocodingService(
      this.httpClient,
      config.get.weatherApi.geocodingApiUrl,
    );
  }
}
