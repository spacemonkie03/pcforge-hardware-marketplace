import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  brand: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsNumber()
  price: number;

  @IsOptional()
  images?: string[];

  @IsOptional()
  specs?: Record<string, any>;

  @IsOptional()
  compatibility?: {
    cpuSocket?: string;
    motherboardSocket?: string;
    ramType?: string;
    psuWattage?: number;
    gpuLengthMm?: number;
    caseGpuMaxLengthMm?: number;
  };

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;
}

