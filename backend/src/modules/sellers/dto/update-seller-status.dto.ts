import { IsEnum } from 'class-validator';
import { SellerStatus } from '../entities/seller.entity';

export class UpdateSellerStatusDto {
  @IsEnum(SellerStatus)
  status: SellerStatus;
}

