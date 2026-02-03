import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis.module';
import { JwtModule } from '@nestjs/jwt';

export const redisModule = RedisModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisModule');

    return {
      connectionOptions: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
      onClientReady: (client) => {
        logger.log('Redis client ready');

        client.on('error', (err) => {
          logger.error('Redis Client Error: ', err);
        });

        client.on('connect', () => {
          logger.log(
            `Connected to redis on ${client.options.host}:${client.options.port}`,
          );
        });
      },
    };
  },
  inject: [ConfigService],
});

export const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const rawTtl = configService.get<string>('POLL_DURATION');
    const ttlSeconds = Number(rawTtl);

    return {
      // For local dev we fall back to a default secret; set JWT_SECRET in env for real deployments.
      secret: configService.get<string>('JWT_SECRET') ?? 'dev-secret',
      signOptions: {
        // JSONWebToken expects seconds or a string like "1h"
        expiresIn:
          Number.isFinite(ttlSeconds) && ttlSeconds > 0 //ttl seconds from config(poll-duration) if valid 
            ? Math.floor(ttlSeconds)
            : 60 * 60,
      },
    };
  },
  inject: [ConfigService],
});
