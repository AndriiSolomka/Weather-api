import {
  GeocodingInterface,
  GeocodingService,
  HttpClient,
  HttpClientInterface,
  LoggerInterface,
  LoggerService,
  RedisClient,
} from '@weather-app/libs';
import { Registry } from 'prom-client';

import { Container } from '../../container';
import { CacheMetricsInterface } from '../../core/cache-metrics.interface';
import { CacheMetrics } from '../../infrastructure/metrics/cache.metrics';

export class InfrastructureModule {
  public readonly logger: LoggerInterface;
  public readonly httpClient: HttpClientInterface;
  public readonly redisClient: RedisClient;
  public readonly geocodingService: GeocodingInterface;
  public readonly cacheMetrics: CacheMetricsInterface;
  public readonly promRegistry: Registry;

  constructor({ config, promRegistry }: Container) {
    this.logger = new LoggerService(config.logger);

    this.httpClient = new HttpClient(this.logger);

    this.redisClient = new RedisClient(config.redis, this.logger);
    this.geocodingService = new GeocodingService(
      this.httpClient,
      config.weatherApi.geocodingApiUrl,
    );

    this.cacheMetrics = new CacheMetrics(promRegistry);
  }
}
