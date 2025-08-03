import { create } from '@bufbuild/protobuf';
import { ConnectRouter } from '@connectrpc/connect';
import {
  GetWeatherRequest,
  GetWeatherResponse,
  GetWeatherResponseSchema,
  WeatherService,
} from '@weather-app/libs';

import { ConnectRouteInterface } from './routes.interface';
import { WeatherInterface } from '../core/weather.interface';

export class WeatherRoutes implements ConnectRouteInterface {
  constructor(private readonly weatherService: WeatherInterface) {}

  register(router: ConnectRouter): void {
    router.service(WeatherService, {
      getWeather: async (
        req: GetWeatherRequest,
      ): Promise<GetWeatherResponse> => {
        const weatherData = await this.weatherService.getWeather(req.city);

        return create(GetWeatherResponseSchema, {
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          description: weatherData.description,
        });
      },
    });
  }
}
