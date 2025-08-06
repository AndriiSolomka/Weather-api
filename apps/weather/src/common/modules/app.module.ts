import { App } from '../../app';
import { Container } from '../../container';

export class AppModule {
  public readonly app: App;

  constructor({ serverModule, infrastructureModule, config }: Container) {
    this.app = new App(
      serverModule.server,
      infrastructureModule.logger,
      config.get.app,
    );
  }
}
