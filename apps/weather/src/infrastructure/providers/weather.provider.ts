import { InternalServerError } from '../../common/errors/internal-server.error';
import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { WeatherData } from '../../core/weather.interface';

export class WeatherProviderChain implements WeatherProviderInterface {
  constructor(private readonly providers: WeatherProviderInterface[]) {}

  async getWeather(city: string): Promise<WeatherData> {
    for (const provider of this.providers) {
      try {
        return await provider.getWeather(city);
      } catch {
        continue;
      }
    }

    throw new InternalServerError(
      'No weather provider could handle the request',
    );
  }
}
