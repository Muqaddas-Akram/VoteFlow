import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT')) || 3000;
  const clientPort = Number(configService.get('CLIENT_PORT')) || 5173;

  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(`^http://192\\.168\\.1\\.([1-9]|[1-9]\\d):${clientPort}$`),
    ],
    // credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}
bootstrap();
