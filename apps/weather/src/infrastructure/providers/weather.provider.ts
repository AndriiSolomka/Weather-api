import { Code, ConnectError } from '@connectrpc/connect';
import { LoggerInterface } from '@weather-app/libs';

import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { WeatherData } from '../../core/weather.interface';

export class WeatherProviderChain implements WeatherProviderInterface {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly providers: WeatherProviderInterface[],
  ) {}

  async getWeather(city: string): Promise<WeatherData> {
    for (const provider of this.providers) {
      try {
        const weather = await provider.getWeather(city);

        this.logger.info({
          context: WeatherProviderChain.name,
          status: 'success',
          provider: provider.constructor.name,
          method: 'getWeather',
          params: { city },
        });

        return weather;
      } catch (error) {
        this.logger.warn({
          context: WeatherProviderChain.name,
          status: 'failed',
          provider: provider.constructor.name,
          method: 'getWeather',
          params: { city },
          error,
        });
        continue;
      }
    }

    const errorMsg = 'No weather provider could handle the request';
    this.logger.error({ msg: errorMsg, city });
    throw new ConnectError(errorMsg, Code.Internal);
  }
}
