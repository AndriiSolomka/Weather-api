import { Container } from 'apps/weather/src/container';
import { CacheMetricsInterface } from 'apps/weather/src/core/cache-metrics.interface';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

describe('metrics controller (integration)', () => {
  let fastifyServer: FastifyInstance;
  let metricsService: CacheMetricsInterface;
  let container: Container;

  beforeAll(async () => {
    container = new Container();
    fastifyServer = container.serverModule.server.getInstance();
    metricsService = container.cacheModule.cacheMetrics;
    await fastifyServer.listen({ port: container.config.get.app.port });
  });

  afterAll(async () => {
    await fastifyServer.close();
  });

  afterEach(() => {
    metricsService.clearAllMetrics();
  });

  beforeEach(() => {
    metricsService.clearAllMetrics();
  });

  describe('GET /metrics', () => {
    it('records cache misses', async () => {
      metricsService.recordCacheMiss('weather', 'get');
      metricsService.recordCacheMiss('city', 'getOrCompute');

      const res = await request(fastifyServer.server).get('/metrics');
      expect(res.status).toBe(200);

      expect(res.text).toContain(
        'cache_miss_total{cache_type="weather",method="get"} 1',
      );
      expect(res.text).toContain(
        'cache_miss_total{cache_type="city",method="getOrCompute"} 1',
      );
    });
  });
});
