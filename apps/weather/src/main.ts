import { Container } from './container';

const main = async () => {
  const container = new Container();
  await container.appModule.app.start();
};

void main();
