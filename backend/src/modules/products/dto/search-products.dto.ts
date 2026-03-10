import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  minRating?: number;

  @IsOptional()
  inStock?: boolean;
}

