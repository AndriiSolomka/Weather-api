import { ConnectRouter } from '@connectrpc/connect';
import { FastifyInstance } from 'fastify';

export interface RouteInterface {
  register(app: FastifyInstance): void;
}

export interface ConnectRouteInterface {
  register(router: ConnectRouter): void;
}
