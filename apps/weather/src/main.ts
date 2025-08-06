import { Container } from './container';

const main = async () => {
  const { appModule } = new Container();
  await appModule.app.start();
};

void main();
