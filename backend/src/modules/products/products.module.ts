import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { PriceHistory } from './entities/price-history.entity';
import { createElasticClient } from '../../config/elastic.config';
import { createRedisClient } from '../../config/redis.config';
import { SellersModule } from '../sellers/sellers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, PriceHistory]), ConfigModule, SellersModule],
  providers: [
    ProductsService,
    {
      provide: 'ELASTIC_CLIENT',
      inject: [ConfigService],
      useFactory: createElasticClient
    },
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: createRedisClient
    }
  ],
  controllers: [ProductsController],
  exports: [ProductsService]
})
export class ProductsModule {}

