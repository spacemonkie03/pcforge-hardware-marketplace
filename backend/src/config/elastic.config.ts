import { ConfigService } from '@nestjs/config';
import { Client } from 'elasticsearch';

export const createElasticClient = (configService: ConfigService): Client => {
  const elastic = configService.get('elastic');
  return new Client({
    node: elastic.node
  } as any);
};

