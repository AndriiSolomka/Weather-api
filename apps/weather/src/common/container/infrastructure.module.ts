import {
  GeocodingInterface,
  GeocodingService,
  HttpClient,
  HttpClientInterface,
  LoggerInterface,
  LoggerService,
  LoggingHttpClient,
  RedisClient,
} from '@weather-app/libs';

import { CacheMetricsInterface } from '../../core/cache-metrics.interface';
import { CacheMetrics } from '../../infrastructure/metrics/cache.metrics';
import { Config } from '../config/config';

export class InfrastructureModule {
  public readonly logger: LoggerInterface;
  public readonly httpClient: HttpClientInterface;
  public readonly geocodingService: GeocodingInterface;
  public readonly redisClient: RedisClient;
  public readonly cacheMetrics: CacheMetricsInterface;

  constructor(private readonly config: Config) {
    this.logger = new LoggerService(this.config.logger);

    this.httpClient = new LoggingHttpClient(new HttpClient(), this.logger);

    this.redisClient = new RedisClient(this.config.redis, this.logger);

    this.geocodingService = new GeocodingService(
      this.httpClient,
      this.config.weatherApi.geocodingApiUrl,
    );

    this.cacheMetrics = new CacheMetrics();
  }
}
