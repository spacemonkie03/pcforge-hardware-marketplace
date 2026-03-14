import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { ormConfig } from './config/ormconfig';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PcBuilderModule } from './modules/pc-builder/pc-builder.module';
import { SearchModule } from './modules/search/search.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AuthModule } from './modules/auth/auth.module';
import { GpusModule } from './gpus/gpus.module';
import { ListingsModule } from './listings/listings.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { PaymentMethodsModule } from './modules/payment-methods/payment-methods.module';
import { CartModule } from './modules/cart/cart.module';
import { ImageStorageModule } from './modules/image-storage/image-storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ormConfig
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    SellersModule,
    ReviewsModule,
    PcBuilderModule,
    SearchModule,
    AddressesModule,
    PaymentMethodsModule,
    CartModule,
    ImageStorageModule,
    OrdersModule,
    GpusModule,
    ListingsModule
  ]
})
export class AppModule {}

