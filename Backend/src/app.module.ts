import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PollsModule } from './polls/polls.module';

@Module({
  imports: [ConfigModule.forRoot(),PollsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
