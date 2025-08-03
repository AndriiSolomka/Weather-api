import { FastifyInstance } from 'fastify';
import { Registry } from 'prom-client';

import { RouteInterface } from './routes.interface';

export class MetricsRoutes implements RouteInterface {
  constructor(private readonly registry: Registry) {}

  register(app: FastifyInstance): void {
    app.get('/metrics', async (_request, reply) => {
      reply.header('Content-Type', this.registry.contentType);
      return reply.send(await this.registry.metrics());
    });

    app.get('/health', async (_request, reply) => {
      return reply.send({ status: 'ok' });
    });
  }
}
