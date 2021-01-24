import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

const PORT = 3000;

async function bootstrap() {
  const logger = new Logger('bootstrap'); // Here we instanciate a new logger and indicate the context (in this case, bootstrap)
  const app = await NestFactory.create(AppModule);
  const port = PORT;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
