import { Container } from '../../../src/common/container';

export async function createTestApp() {
  const container = new Container();
  const app = container.app;
  await app.start();

  return {
    app,
    container,
    cacheRepository: container.getCacheRepository(),
    server: container.getServer(),
    close: () => app.close(),
  };
}
