import { Container } from 'apps/weather/src/common/container';
import { CacheMetricsInterface } from 'apps/weather/src/core/cache-metrics.interface';
import { register } from 'apps/weather/src/infrastructure/metrics/cache.metrics.factory';
import { CACHE_OPERATION_STATUS } from 'apps/weather/src/infrastructure/metrics/constants/metrics.constants';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

describe('MetricsService (integration)', () => {
  let server: FastifyInstance;
  let metricsService: CacheMetricsInterface;
  let container: Container;

  beforeAll(async () => {
    container = new Container();
    server = container.serverModule.server.getInstance();
    metricsService = container.infrastructureModule.cacheMetrics;
    await server.listen({ port: 5051 });
  });

  beforeEach(() => {
    metricsService.clearAllMetrics();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should record cache hits', async () => {
    metricsService.recordCacheHit('weather', 'get');
    metricsService.recordCacheHit('weather', 'get');
    metricsService.recordCacheHit('city', 'get');

    console.log(metricsService.recordCacheHit('weather', 'get'));

    const res = await request(server.server).get('/metrics');

    expect(res.status).toBe(200);
    expect(res.text).toContain(
      'cache_hit_total{cache_type="weather",method="get",app="weather-api"} 2',
    );
    expect(res.text).toContain(
      'cache_hit_total{cache_type="city",method="get",app="weather-api"} 1',
    );
  });

  // it('should record cache misses', async () => {
  //   metricsService.recordCacheMiss('weather', 'get');
  //   metricsService.recordCacheMiss('city', 'getOrCompute');

  //   const res = await request(server.server).get('/metrics');
  //   expect(res.status).toBe(200);
  //   expect(res.text).toContain(
  //     'cache_miss_total{cache_type="weather",method="get",app="weather-api"}',
  //   );
  //   expect(res.text).toContain(
  //     'cache_miss_total{cache_type="city",method="getOrCompute",app="weather-api"}',
  //   );
  // });

  // it('should set cache size', async () => {
  //   metricsService.setCacheSize('weather', 10);
  //   metricsService.setCacheSize('city', 5);

  //   const res = await request(server.server).get('/metrics');
  //   expect(res.status).toBe(200);
  //   expect(res.text).toContain(
  //     'cache_size{cache_type="weather",app="weather-api"} 10',
  //   );
  //   expect(res.text).toContain(
  //     'cache_size{cache_type="city",app="weather-api"} 5',
  //   );
  // });

  // it('should record cache operation durations', async () => {
  //   const endTimer = metricsService.createCacheOperationStopper(
  //     'weather',
  //     'set',
  //   );
  //   await new Promise((r) => setTimeout(r, 10));
  //   endTimer(CACHE_OPERATION_STATUS.SUCCESS);

  //   const res = await request(server.server).get('/metrics');
  //   expect(res.status).toBe(200);
  //   expect(res.text).toContain(
  //     'cache_operation_duration_seconds_bucket{le="0.5",app="weather-api",cache_type="weather",operation="set",status="success"}',
  //   );
  //   expect(res.text).toContain(
  //     'cache_operation_duration_seconds_count{app="weather-api",cache_type="weather",operation="set",status="success"}',
  //   );
  // });

  // it('should record different operation statuses', async () => {
  //   const successTimer = metricsService.createCacheOperationStopper(
  //     'city',
  //     'get',
  //   );
  //   await new Promise((r) => setTimeout(r, 5));
  //   successTimer(CACHE_OPERATION_STATUS.SUCCESS);

  //   const errorTimer = metricsService.createCacheOperationStopper(
  //     'city',
  //     'get',
  //   );
  //   await new Promise((r) => setTimeout(r, 5));
  //   errorTimer(CACHE_OPERATION_STATUS.ERROR);

  //   const res = await request(server.server).get('/metrics');

  //   expect(res.status).toBe(200);
  //   expect(res.text).toContain(
  //     'cache_operation_duration_seconds_count{app="weather-api",cache_type="city",operation="get",status="success"}',
  //   );
  //   expect(res.text).toContain(
  //     'cache_operation_duration_seconds_count{app="weather-api",cache_type="city",operation="get",status="error"}',
  //   );
  // });
});
