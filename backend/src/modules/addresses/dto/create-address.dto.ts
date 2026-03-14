import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  line1: string;

  @IsOptional()
  line2?: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  postalCode: string;

  @IsOptional()
  country?: string;

  @IsOptional()
  landmark?: string;

  @IsOptional()
  label?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
