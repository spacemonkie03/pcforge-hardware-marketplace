import { Module } from '@nestjs/common';
import { ImageStorageController } from './image-storage.controller';
import { ImageStorageService } from './image-storage.service';

@Module({
  controllers: [ImageStorageController],
  providers: [ImageStorageService],
  exports: [ImageStorageService],
})
export class ImageStorageModule {}
