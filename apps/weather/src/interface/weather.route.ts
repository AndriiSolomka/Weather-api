import { ConnectRouter } from '@connectrpc/connect';
import { WeatherService } from '@weather-app/libs';

import { ConnectRouteInterface } from './routes.interface';
import { WeatherInterface } from '../core/weather.interface';

export class WeatherRoutes implements ConnectRouteInterface {
  constructor(private readonly weatherService: WeatherInterface) {}

  register(router: ConnectRouter): void {
    router.service(WeatherService, {
      getWeather: ({ city }) => this.weatherService.getWeather(city),
    });
  }
}
