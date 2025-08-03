import { LoggerInterface, LoggingDecoratorBase } from '@weather-app/libs';

import { WeatherProviderInterface } from '../../core/weather-provider.interface';
import { WeatherData } from '../../core/weather.interface';

export class LoggingWeatherProviderDecorator
  extends LoggingDecoratorBase<WeatherProviderInterface>
  implements WeatherProviderInterface
{
  constructor(
    wrapped: WeatherProviderInterface,
    logger: LoggerInterface,
    context: string,
  ) {
    super(wrapped, logger, context);
  }

  getWeather(city: string): Promise<WeatherData> {
    return this.logAndExecute('getWeather', { city }, () =>
      this.wrapped.getWeather(city),
    );
  }
}
