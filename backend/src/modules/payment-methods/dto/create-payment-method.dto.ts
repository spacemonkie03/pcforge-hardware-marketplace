import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { PaymentMethodType } from '../entities/payment-method.entity';

export class CreatePaymentMethodDto {
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @IsNotEmpty()
  provider: string;

  @IsNotEmpty()
  label: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
