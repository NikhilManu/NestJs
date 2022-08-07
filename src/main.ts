import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const cookieSession = require('cookie-session'); // using like this due to configuration mismatch b/w nest and cookie

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
      keys: ['asdfge']
    })
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
