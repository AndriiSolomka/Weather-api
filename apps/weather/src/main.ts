import { Container } from './common/container';

const main = async () => {
  const { app } = new Container();
  await app.start();
};

void main();
