import { Container } from 'apps/weather/src/container';
import { CacheMetricsInterface } from 'apps/weather/src/core/cache-metrics.interface';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

describe('metrics controller (integration)', () => {
  let server: FastifyInstance;
  let metricsService: CacheMetricsInterface;
  let container: Container;

  beforeAll(async () => {
    container = new Container();
    server = container.serverModule.server.getInstance();
    metricsService = container.cacheModule.cacheMetrics;
    await server.listen({ port: container.config.get.app.port });
  });

  afterAll(async () => {
    await server.close();
  });

  afterEach(() => {
    metricsService.clearAllMetrics();
  });

  beforeEach(() => {
    metricsService.clearAllMetrics();
  });

  const getMetrics = async (expectedStatus = 200) => {
    const res = await request(server.server).get('/metrics');
    expect(res.status).toBe(expectedStatus);
    expect(res.headers['content-type']).toContain('text/plain');
    return res.text;
  };

  describe('GET /metrics', () => {
    it('records cache misses', async () => {
      metricsService.recordCacheMiss('weather', 'get');
      metricsService.recordCacheMiss('city', 'getOrCompute');

      const data = await getMetrics();

      expect(data).toContain(
        'cache_miss_total{cache_type="weather",method="get"} 1',
      );
      expect(data).toContain(
        'cache_miss_total{cache_type="city",method="getOrCompute"} 1',
      );
    });
  });
});
