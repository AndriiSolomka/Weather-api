import { ConnectRouter } from '@connectrpc/connect';
import { WeatherService } from '@weather-app/libs';

import { ConnectRouteInterface } from './routes.interface';
import { WeatherInterface } from '../core/weather.interface';
import { getWeatherHandler } from '../infrastructure/handlers/weather.handler';

export class WeatherRoutes implements ConnectRouteInterface {
  constructor(private readonly weatherService: WeatherInterface) {}

  register(router: ConnectRouter): void {
    router.service(WeatherService, {
      getWeather: getWeatherHandler(this.weatherService),
    });
  }
}
