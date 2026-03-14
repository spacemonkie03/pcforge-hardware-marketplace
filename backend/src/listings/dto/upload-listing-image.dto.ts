import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UploadListingImageDto {
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  isPrimary?: boolean;
}
