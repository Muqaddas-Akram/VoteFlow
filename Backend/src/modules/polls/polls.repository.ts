import { Inject, InternalServerErrorException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, Command } from 'ioredis';
import { IORedisKey } from '../../config/redis.module';
import { CreatePollData, AddParticipantData } from './types';
import { Poll } from '../../shared/poll-types';

@Injectable()
export class PollsRepository {
  // to use time-to-live from configuration
  private readonly ttlSeconds: number;
  private readonly logger = new Logger(PollsRepository.name);

  constructor(
    configService: ConfigService,
    @Inject(IORedisKey) private readonly redisClient: Redis,
  ) {
    const rawTtl = configService.get<string>('POLL_DURATION');
    const parsed = Number(rawTtl);

    // If POLL_DURATION isn't set, Redis `EXPIRE` will error and abort our MULTI/EXEC.
    // Default to 1 hour for local dev; override via env var when needed.
    if (!Number.isFinite(parsed) || parsed <= 0) {
      this.ttlSeconds = 60 * 60;
      this.logger.warn(
        `POLL_DURATION is missing/invalid (${rawTtl}); defaulting to ${this.ttlSeconds}s`,
      );
    } else {
      this.ttlSeconds = Math.floor(parsed);
    }
  }

  // Create a new poll in Redis with initial data
  async createPoll({
    votesPerVoter,
    topic,
    pollID,
    userID,
  }: CreatePollData): Promise<Poll> {
    const initialPoll = {
      id: pollID,
      topic,
      votesPerVoter,
      participants: {},
      nominations: {},
      rankings: {},
      results: [],
      adminID: userID,
      hasStarted: false,
    };

    this.logger.log(
      `Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${
        this.ttlSeconds
      }`,
    );

    const key = `polls:${pollID}`;

    try {
      await this.redisClient
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
          ['expire', key, this.ttlSeconds],
        ])
        .exec();
      return initialPoll;
    } catch (e) {
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initialPoll)}\n${e}`,
      );
      throw new InternalServerErrorException();
    }
  }
  // Get a poll from Redis by its ID
  async getPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Attempting to get poll with: ${pollID}`);

    const key = `polls:${pollID}`;

    try {
      const currentPoll = await this.redisClient.sendCommand(
        new Command('JSON.GET', [key, '.']),
      );

      this.logger.verbose(currentPoll);

      return JSON.parse(currentPoll as string);
    } catch (e) {
      this.logger.error(`Failed to get pollID ${pollID}`);
      throw new InternalServerErrorException(`Failed to get pollID ${pollID}`);
    }
  }
// Add a participant to an existing poll in Redis
  async addParticipant({
    pollID,
    userID,
    name,
  }: AddParticipantData): Promise<Poll> {
    this.logger.log(
      `Attempting to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
    );

    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.sendCommand(
        new Command('JSON.SET', [key, participantPath, JSON.stringify(name)]),
      );

      // Poll fetch kar ke updated object return kar rahe hain
      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(
        `Failed to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
      );
      throw new InternalServerErrorException(
        `Failed to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`,
      );
    }
  }
}
