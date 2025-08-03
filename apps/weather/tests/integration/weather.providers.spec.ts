import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-node';
import { config } from 'apps/weather/src/common/config/config';
import { WeatherService } from 'libs/src/common/proto/generated/weather/v1/weather_pb';
import { CacheRepositoryInterface } from 'libs/src/core/cache/cache-repository.interface';

import { searchApi } from '../utils/mocks/geocoding';
import { openMeteoApi } from '../utils/mocks/openmeteo';
import { weatherApi } from '../utils/mocks/weather-api';
import { mockServer } from '../utils/msw/setup';
import { createTestApp } from '../utils/server/test.app';

function resetMockServerWeatherApi() {
  mockServer.clearHandlers();
  mockServer.addHandlers([searchApi.ok()]);
}

async function clearCityCache(
  cacheRepository: CacheRepositoryInterface,
  city: string,
) {
  const key = city.toLowerCase();
  await cacheRepository.set('city', key, '');
  await cacheRepository.set('weather', key, '');
}

describe('WeatherService API (integration)', () => {
  const SERVER_URL = `http://${config.app.host}:${config.app.port}`;
  const validCity = 'Kyiv';
  const invalidCity = 'NonExistentCity';

  let weatherClient: ReturnType<typeof createClient<typeof WeatherService>>;
  let testApp: Awaited<ReturnType<typeof createTestApp>>;

  beforeAll(async () => {
    testApp = await createTestApp();

    const transport = createConnectTransport({
      baseUrl: SERVER_URL,
      httpVersion: '1.1',
    });

    weatherClient = createClient(WeatherService, transport);
  });

  afterEach(async () => {
    await clearCityCache(testApp.cacheRepository, validCity);
    await clearCityCache(testApp.cacheRepository, invalidCity);
  });

  afterAll(async () => {
    await testApp.close();
  });

  describe('GetWeather API', () => {
    it('should return weather from WeatherApiProvider if available', async () => {
      mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);
      const res = await weatherClient.getWeather({ city: validCity });

      expect(res).toEqual({
        temperature: 20,
        humidity: 50,
        description: 'Sunny',
      });
    });

    it('should fallback to OpenMeteoProvider if WeatherApiProvider fails', async () => {
      mockServer.addHandlers([
        weatherApi.notFound(),
        searchApi.ok(),
        openMeteoApi.ok(),
      ]);

      const res = await weatherClient.getWeather({ city: validCity });

      expect(res).toEqual({
        temperature: 18,
        humidity: 65,
        description: 'Mainly clear',
      });
    });

    it('should throw error if all providers fail', async () => {
      mockServer.addHandlers([
        weatherApi.notFound(),
        searchApi.notFound(),
        openMeteoApi.error(),
      ]);

      await expect(
        weatherClient.getWeather({ city: invalidCity }),
      ).rejects.toThrow();
    });

    it('should cache weather data from WeatherApiProvider and return cached value on second request', async () => {
      mockServer.addHandlers([searchApi.ok(), weatherApi.ok()]);
      const key = validCity.toLowerCase();

      const res1 = await weatherClient.getWeather({ city: validCity });

      resetMockServerWeatherApi();
      const res2 = await weatherClient.getWeather({ city: validCity });

      expect(res2).toEqual(res1);

      const cachedData = await testApp.cacheRepository.get('weather', key);
      expect(cachedData).toBeTruthy();
      if (cachedData) {
        expect(JSON.parse(cachedData)).toEqual(res1);
      }
    });

    it('should cache weather data from OpenMeteoProvider and return cached value on second request', async () => {
      mockServer.addHandlers([
        searchApi.ok(),
        weatherApi.notFound(),
        openMeteoApi.ok(),
      ]);
      const key = validCity.toLowerCase();

      const res1 = await weatherClient.getWeather({ city: validCity });

      resetMockServerWeatherApi();
      const res2 = await weatherClient.getWeather({ city: validCity });

      expect(res2).toEqual(res1);

      const cachedData = await testApp.cacheRepository.get('weather', key);
      expect(cachedData).toBeTruthy();
      if (cachedData) {
        expect(JSON.parse(cachedData)).toEqual(res1);
      }
    });
  });
});
