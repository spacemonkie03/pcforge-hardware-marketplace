import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class UpdateListingDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}
