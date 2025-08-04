import { FastifyInstance } from 'fastify';
import metricsPlugin from 'fastify-metrics';

import { RouteInterface } from './routes.interface';

export class MetricsRoutes implements RouteInterface {
  register(app: FastifyInstance): void {
    app.register(metricsPlugin, {
      endpoint: '/metrics',
      defaultMetrics: {
        enabled: false,
      },
    });
  }
}
