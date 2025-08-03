import {
  Coordinates,
  GeocodingInterface,
  HttpClientInterface,
} from '@weather-app/libs';

import { WeatherApiConfig } from '../../common/config/weather-api.config';
import { NotFoundError } from '../../common/errors/not-found.error';
import {
  OpenMeteoResponse,
  openMeteoWeatherCodeMap,
} from '../../common/types/weather.interface';
import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { WeatherData } from '../../core/weather.interface';

const OPEN_METEO_CURRENT_WEATHER_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'weather_code',
];

function getWeatherDescription(weatherCode: number): string {
  return openMeteoWeatherCodeMap[weatherCode] ?? 'Unknown weather condition';
}

function parseWeatherData(response: OpenMeteoResponse): WeatherData {
  return {
    temperature: response.current.temperature_2m,
    humidity: response.current.relative_humidity_2m,
    description: getWeatherDescription(response.current.weather_code),
  };
}

export class OpenMeteoProviderService implements WeatherProviderInterface {
  constructor(
    private readonly httpService: HttpClientInterface,
    private readonly config: WeatherApiConfig,
    private readonly cityService: GeocodingInterface,
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    const coordinates = await this.cityService.getCityCoordinates(city);

    if (!coordinates) throw new NotFoundError('City', city);

    const url = this.buildUrl(coordinates);
    const response = await this.httpService.get<OpenMeteoResponse>(url);
    return parseWeatherData(response);
  }

  private buildUrl({ latitude, longitude }: Coordinates): string {
    const currentFields = OPEN_METEO_CURRENT_WEATHER_FIELDS.join(',');
    return `${this.config.openMeteoApiUrl}/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentFields}`;
  }
}
