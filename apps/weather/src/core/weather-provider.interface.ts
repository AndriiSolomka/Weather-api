import { WeatherData } from './weather.interface';

export interface WeatherProviderInterface {
  getWeather(city: string): Promise<WeatherData>;
}
