import { HttpClientInterface } from '@weather-app/libs';

import { WeatherApiConfig } from '../../common/config/weather-api.config';
import { WeatherApiResponse } from '../../common/types/weather.interface';
import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { WeatherData } from '../../core/weather.interface';

function parseWeatherData(response: WeatherApiResponse): WeatherData {
  return {
    temperature: response.current.temp_c,
    humidity: response.current.humidity,
    description: response.current.condition.text,
  };
}

export class WeatherApiProviderService implements WeatherProviderInterface {
  constructor(
    private readonly httpService: HttpClientInterface,
    private readonly config: WeatherApiConfig,
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    const url = this.buildUrl(city);
    const response = await this.httpService.get<WeatherApiResponse>(url);
    return parseWeatherData(response);
  }

  private buildUrl(city: string): string {
    return `${this.config.weatherApiUrl}/current.json?key=${this.config.weatherApiKey}&q=${city}&aqi=yes`;
  }
}
