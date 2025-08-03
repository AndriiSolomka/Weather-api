import { Registry } from 'prom-client';

import { Container } from '../../container';
import { WeatherInterface } from '../../core/weather.interface';
import { MetricsRoutes } from '../../interface/metrics.route';
import { WeatherRoutes } from '../../interface/weather.route';
import { Server } from '../../server';

export class ServerModule {
  public readonly server: Server;
  public readonly weatherService: WeatherInterface;
  public readonly promRegistry: Registry;

  constructor({ weatherModule, infrastructureModule }: Container) {
    this.weatherService = weatherModule.weatherService;
    this.promRegistry = infrastructureModule.promRegistry;
    this.server = new Server();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.server.registerFastifyRoute(new MetricsRoutes(this.promRegistry));
    this.server.registerConnectRoute(new WeatherRoutes(this.weatherService));
  }
}
