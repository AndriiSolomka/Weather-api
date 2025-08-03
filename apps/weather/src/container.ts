import { Registry } from 'prom-client';

import { ConfigService } from './common/config/config';
import { AppModule } from './common/modules/app.module';
import { CacheModule } from './common/modules/cache.module';
import { InfrastructureModule } from './common/modules/infrastructure.module';
import { ServerModule } from './common/modules/server.module';
import { WeatherModule } from './common/modules/weather.module';

export class Container {
  public config = new ConfigService();

  public promRegistry = new Registry();

  public infrastructureModule = new InfrastructureModule(this);

  public cacheModule = new CacheModule(this);

  public weatherModule = new WeatherModule(this);

  public serverModule = new ServerModule(this);

  public appModule = new AppModule(this);
}
