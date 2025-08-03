import { create } from '@bufbuild/protobuf';
import {
  GetWeatherRequest,
  GetWeatherResponse,
  GetWeatherResponseSchema,
} from '@weather-app/libs';

import { WeatherInterface } from '../../core/weather.interface';

export function getWeatherHandler(weatherService: WeatherInterface) {
  return async (req: GetWeatherRequest): Promise<GetWeatherResponse> => {
    const weatherData = await weatherService.getWeather(req.city);

    return create(GetWeatherResponseSchema, {
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      description: weatherData.description,
    });
  };
}
