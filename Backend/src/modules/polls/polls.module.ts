import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { jwtModule, redisModule } from 'src/config/module.config';
import { PollsRepository } from './polls.repository';
import { PollsGateway } from './polls.gateway';

@Module({
  imports: [ConfigModule, redisModule, jwtModule],
  controllers: [PollsController],
  providers: [PollsService, PollsRepository, PollsGateway],
})
export class PollsModule{}
