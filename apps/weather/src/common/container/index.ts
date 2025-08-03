import { CacheRepositoryInterface } from '@weather-app/libs';

import { CacheModule } from './cache.module';
import { InfrastructureModule } from './infrastructure.module';
import { ServerModule } from './server.module';
import { WeatherModule } from './weather.module';
import { App } from '../../app';
import { config } from '../config/config';

export class Container {
  private readonly infrastructureModule: InfrastructureModule;
  private readonly cacheModule: CacheModule;
  private readonly weatherModule: WeatherModule;
  private readonly serverModule: ServerModule;

  constructor() {
    this.infrastructureModule = new InfrastructureModule(config);

    this.cacheModule = new CacheModule(
      config.cache,
      this.infrastructureModule.redisClient,
      this.infrastructureModule.logger,
      this.infrastructureModule.cacheMetrics,
    );

    this.weatherModule = new WeatherModule(
      config.weatherApi,
      this.infrastructureModule.httpClient,
      this.infrastructureModule.geocodingService,
      this.cacheModule.weatherCache,
      this.infrastructureModule.logger,
    );

    this.serverModule = new ServerModule(this.weatherModule.weatherService);
  }

  public get app(): App {
    return new App(
      this.serverModule.server,
      this.infrastructureModule.logger,
      config.app,
    );
  }

  public getCacheRepository(): CacheRepositoryInterface {
    return this.cacheModule.redisRepository;
  }

  public getServer() {
    return this.serverModule.server;
  }
}
