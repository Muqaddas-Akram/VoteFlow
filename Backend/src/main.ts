import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './socket-io-adapter'

async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT')) || 3001;
  const clientPort = Number(configService.get('CLIENT_PORT')) || 5173;

  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(`^http://192\\.168\\.1\\.([1-9]|[1-9]\\d):${clientPort}$`),
    ],
    // credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}
bootstrap();
