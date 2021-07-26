import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap'); // Here we instanciate a new logger and indicate the context (in this case, bootstrap)
  const app = await NestFactory.create(AppModule);

  // if (process.env.NODE_ENV === 'development') { //this should work, but the node env is not in development mode, idk why
    app.enableCors();
  // }
  
  const port = 3000; // TODO: Change it in order to add the port of the application in the config module
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
