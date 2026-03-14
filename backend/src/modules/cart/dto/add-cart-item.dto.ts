import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { CartItemType } from '../entities/cart-item.entity';

export class AddCartItemDto {
  @IsEnum(CartItemType)
  itemType: CartItemType;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  listingId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
