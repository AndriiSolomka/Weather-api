import { AppModule } from './app.module';
import { CacheModule } from './cache.module';
import { InfrastructureModule } from './infrastructure.module';
import { ServerModule } from './server.module';
import { WeatherModule } from './weather.module';
import { config } from '../config/config';

export class Container {
  public infrastructureModule: InfrastructureModule;
  public cacheModule: CacheModule;
  public weatherModule: WeatherModule;
  public serverModule: ServerModule;
  public appModule: AppModule;

  constructor() {
    this.initializeModules();
  }

  private initializeModules(): void {
    this.infrastructureModule = this.createInfrastructureModule();
    this.cacheModule = this.createCacheModule();
    this.weatherModule = this.createWeatherModule();
    this.serverModule = this.createServerModule();
    this.appModule = this.createAppModule();
  }

  private createInfrastructureModule(): InfrastructureModule {
    return new InfrastructureModule(config);
  }

  private createCacheModule(): CacheModule {
    return new CacheModule(
      config.cache,
      this.infrastructureModule.redisClient,
      this.infrastructureModule.logger,
      this.infrastructureModule.cacheMetrics,
    );
  }

  private createWeatherModule(): WeatherModule {
    return new WeatherModule(
      config.weatherApi,
      this.infrastructureModule.httpClient,
      this.infrastructureModule.geocodingService,
      this.cacheModule.weatherCache,
      this.infrastructureModule.logger,
    );
  }

  private createServerModule(): ServerModule {
    return new ServerModule(this.weatherModule.weatherService);
  }

  private createAppModule(): AppModule {
    return new AppModule(
      this.serverModule.server,
      this.infrastructureModule.logger,
      config.app,
    );
  }
}
