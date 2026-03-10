import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const createRedisClient = (configService: ConfigService): Redis => {
  const redisConfig = configService.get('redis');
  return new Redis({
    host: redisConfig.host,
    port: redisConfig.port
  });
};

