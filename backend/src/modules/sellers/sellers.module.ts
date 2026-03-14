import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seller, User])],
  providers: [SellersService],
  controllers: [SellersController],
  exports: [SellersService]
})
export class SellersModule {}

