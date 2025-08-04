import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { CacheRepositoryInterface, WeatherService } from '@weather-app/libs';
import { Container } from 'apps/weather/src/container';
import { FastifyInstance } from 'fastify';

import { weatherApi } from '../utils/mocks/weather-api';
import { mockServer } from '../utils/msw/setup';

const validCity = 'Kyiv';
const invalidCity = 'NonExistentCity';

async function clearCityCache(
  cacheRepository: CacheRepositoryInterface,
  city: string,
) {
  const key = city.toLowerCase();
  await cacheRepository.set('city', key, '');
  await cacheRepository.set('weather', key, '');
}

describe('WeatherService API (integration)', () => {
  let weatherClient: ReturnType<typeof createClient<typeof WeatherService>>;
  let server: FastifyInstance;
  let container: Container;
  let cacheRepository: CacheRepositoryInterface;

  beforeAll(async () => {
    container = new Container();
    mockServer.start();
    server = container.serverModule.server.getInstance();
    cacheRepository = container.cacheModule.redisRepository;

    await server.listen({ port: container.config.app.port });

    const transport = createConnectTransport({
      baseUrl: `http://${container.config.app.host}:${container.config.app.port}`,
    });

    weatherClient = createClient(WeatherService, transport);
  });

  afterEach(async () => {
    await clearCityCache(cacheRepository, validCity);
    await clearCityCache(cacheRepository, invalidCity);
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return weather', async () => {
    mockServer.addHandlers([weatherApi.ok()]);

    const res = await weatherClient.getWeather({ city: validCity });
    console.log(res);
  });
});
