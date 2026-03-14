import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { AddressesModule } from '../addresses/addresses.module';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { Listing } from '../../listings/entities/listing.entity';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    TypeOrmModule.forFeature([Listing]),
    AddressesModule,
    PaymentMethodsModule,
    CartModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
