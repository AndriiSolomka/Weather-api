import { FastifyInstance } from 'fastify';

import { RouteInterface } from './routes.interface';
import { register } from '../infrastructure/metrics/cache.metrics.factory';

export class MetricsRoutes implements RouteInterface {
  register(app: FastifyInstance): void {
    app.get('/metrics', async (_request, reply) => {
      reply.header('Content-Type', register.contentType);
      return reply.send(await register.metrics());
    });

    app.get('/health', async (_request, reply) => {
      return reply.send({ status: 'ok' });
    });
  }
}
