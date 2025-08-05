import {
  AbstractConfigService,
  LoggerConfigSchema,
  RedisConfigSchema,
} from '@weather-app/libs';
import dotenv from 'dotenv';
import { z } from 'zod';

import { AppConfigSchema } from './app.config';
import { CacheConfigSchema } from './cache.config';
import { WeatherApiConfigSchema } from './weather-api.config';

dotenv.config();

const ConfigSchema = z.object({
  app: AppConfigSchema,
  logger: LoggerConfigSchema,
  cache: CacheConfigSchema,
  weatherApi: WeatherApiConfigSchema,
  redis: RedisConfigSchema,
});

export type Config = z.infer<typeof ConfigSchema>;

function parseEnvConfig() {
  return ConfigSchema.parse({
    app: {
      port: process.env.PORT,
      host: process.env.HOST,
      gracefulShutdownDelay: process.env.GRACEFUL_SHUTDOWN_DELAY,
    },
    logger: {
      enableLogging: process.env.ENABLE_LOGGING,
      enableDebugLogging: process.env.ENABLE_DEBUG_LOGGING,
      filePath: process.env.LOG_FILE_PATH,
      pretty: process.env.LOG_PRETTY,
      level: process.env.LOG_LEVEL,
      lokiHost: process.env.LOKI_HOST,
      lokiLevel: process.env.LOKI_LEVEL,
      appName: process.env.APP_NAME,
      version: process.env.APP_VERSION,
    },
    cache: {
      weatherCachePrefix: process.env.WEATHER_CACHE_PREFIX,
      weatherCacheTTL: process.env.WEATHER_CACHE_TTL,
    },
    weatherApi: {
      weatherApiKey: process.env.WEATHER_API_KEY,
      weatherApiUrl: process.env.WEATHER_API_URL,
      openMeteoApiUrl: process.env.OPEN_METEO_API_URL,
      geocodingApiUrl: process.env.GEOCODING_API_URL,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });
}

export class ConfigService extends AbstractConfigService<Config> {
  constructor() {
    super(ConfigSchema, parseEnvConfig());
  }
}
