import { LoggerInterface } from '@weather-app/libs';
import closeWithGrace, { CloseWithGraceAsyncCallback } from 'close-with-grace';

import { AppConfig } from './common/config/app.config';
import { Server } from './server';

export class App {
  constructor(
    private readonly server: Server,
    private readonly logger: LoggerInterface,
    private readonly config: AppConfig,
  ) {}

  private setupGracefulShutdown() {
    const shutdownHandler: CloseWithGraceAsyncCallback = async ({ err }) => {
      if (err) this.logger.error({ msg: 'Shutdown due to error', err });

      this.logger.info({ msg: 'Graceful shutdown started' });

      try {
        await this.server.close();
        this.logger.info({ msg: 'Server closed' });
      } catch (error) {
        this.logger.error({ msg: 'Error while closing server', error });
      }

      this.logger.info({ msg: 'Graceful shutdown finished' });
    };

    closeWithGrace(
      {
        delay: this.config.gracefulShutdownDelay,
        logger: this.logger,
      },
      shutdownHandler,
    );

    process.on('unhandledRejection', (reason) => {
      this.logger.error({ msg: 'UnhandledRejection', reason });
    });

    process.on('uncaughtException', (error) => {
      this.logger.error({ msg: 'UncaughtException', error });
    });

    this.logger.info({
      msg: 'Graceful shutdown handlers registered',
      delay: this.config.gracefulShutdownDelay,
    });
  }

  public async start() {
    this.setupGracefulShutdown();
    await this.server.listen(this.config.port, this.config.host);

    this.logger.info({
      msg: `Server started on http://${this.config.host}:${this.config.port}`,
    });
  }

  public async close(): Promise<void> {
    await this.server.close();
    this.logger.info({ msg: 'Server closed manually' });
  }
}
