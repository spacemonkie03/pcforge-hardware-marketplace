import { BadRequestException, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ImageStorageService, MAX_IMAGE_FILE_SIZE_BYTES } from './image-storage.service';

@Controller('images')
export class ImageStorageController {
  constructor(private readonly imageStorageService: ImageStorageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload/:scope')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_IMAGE_FILE_SIZE_BYTES,
      },
      fileFilter: (_req, file, callback) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
          callback(new BadRequestException('Only jpg, png, and webp images are allowed.'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  async upload(
    @Param('scope') scope: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    const parsedScope = this.imageStorageService.parseScope(scope);
    return this.imageStorageService.saveImage(file, parsedScope);
  }
}
