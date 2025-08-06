import { GetWeatherRequest } from '@weather-app/libs';

import { WeatherInterface } from '../../core/weather.interface';

export function getWeatherHandler(weatherService: WeatherInterface) {
  return async (req: GetWeatherRequest) => {
    return await weatherService.getWeather(req.city);
  };
}
