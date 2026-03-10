import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchService } from './search.service';
import { createElasticClient } from '../../config/elastic.config';

@Module({
  imports: [ConfigModule],
  providers: [
    SearchService,
    {
      provide: 'ELASTIC_CLIENT',
      inject: [ConfigService],
      useFactory: createElasticClient
    }
  ],
  exports: [SearchService, 'ELASTIC_CLIENT']
})
export class SearchModule {}

