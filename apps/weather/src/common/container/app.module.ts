import { LoggerInterface } from '@weather-app/libs';

import { App } from '../../app';
import { Server } from '../../server';
import { AppConfig } from '../config/app.config';

export class AppModule {
  public readonly app: App;

  constructor(
    private readonly server: Server,
    private readonly logger: LoggerInterface,
    private readonly config: AppConfig,
  ) {
    this.app = new App(this.server, this.logger, this.config);
  }
}
