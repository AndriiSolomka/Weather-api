import { Container } from '../../../src/common/container';

export async function createTestApp() {
  const container = new Container();
  await container.serverModule.server.listen(0, 'localhost');

  return {
    container,
    close: () => container.serverModule.server.close(),
  };
}
