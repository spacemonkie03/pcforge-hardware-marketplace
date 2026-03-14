import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchService } from './search.service';
import { createElasticClient } from '../../config/elastic.config';
import { SearchController } from './search.controller';
import { ProductsModule } from '../products/products.module';
import { ListingsModule } from '../../listings/listings.module';
import { GpusModule } from '../../gpus/gpus.module';

@Module({
  imports: [ConfigModule, ProductsModule, ListingsModule, GpusModule],
  providers: [
    SearchService,
    {
      provide: 'ELASTIC_CLIENT',
      inject: [ConfigService],
      useFactory: createElasticClient
    }
  ],
  controllers: [SearchController],
  exports: [SearchService, 'ELASTIC_CLIENT']
})
export class SearchModule {}

