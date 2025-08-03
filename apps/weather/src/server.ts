import { fastifyConnectPlugin } from '@connectrpc/connect-fastify';
import Fastify, { FastifyInstance } from 'fastify';

import {
  ConnectRouteInterface,
  RouteInterface,
} from './interface/routes.interface';

export class Server {
  private readonly app: FastifyInstance;
  private readonly fastifyRoutes: RouteInterface[] = [];
  private readonly connectRoutes: ConnectRouteInterface[] = [];

  constructor() {
    this.app = Fastify();
  }

  public registerFastifyRoute(route: RouteInterface): Server {
    this.fastifyRoutes.push(route);
    return this;
  }

  public registerConnectRoute(route: ConnectRouteInterface): Server {
    this.connectRoutes.push(route);
    return this;
  }

  public async listen(port: number, host: string): Promise<void> {
    for (const route of this.fastifyRoutes) {
      route.register(this.app);
    }

    await this.app.register(fastifyConnectPlugin, {
      routes: (router) => {
        for (const route of this.connectRoutes) {
          route.register(router);
        }
      },
    });

    await this.app.listen({ port, host });
  }

  public async close(): Promise<void> {
    await this.app.close();
  }
}
