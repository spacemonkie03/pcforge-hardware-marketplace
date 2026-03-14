import { ConfigService } from '@nestjs/config';
import { Client } from 'elasticsearch';

export const createElasticClient = (configService: ConfigService): Client => {
  const elastic = configService.get('elastic');
  return new Client({
    host: elastic.node
  } as any);
};

