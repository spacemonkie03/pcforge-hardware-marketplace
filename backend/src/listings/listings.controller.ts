import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { UpdateListingDto } from './dto/update-listing.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MAX_IMAGE_FILE_SIZE_BYTES } from '../modules/image-storage/image-storage.service';
import { UploadListingImageDto } from './dto/upload-listing-image.dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  async list(
    @Query('q') q?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string
  ) {
    return this.listingsService.findAll({
      q,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

  @Get('sellers/:id/profile')
  async sellerProfile(@Param('id') id: string) {
    return this.listingsService.getSellerProfile(id);
  }

  @Get(':id')
  async detail(@Param('id') id: string, @Request() req: any) {
    return this.listingsService.findOneAndTrackView(Number(id), req.headers?.authorization);
  }

  @Get(':id/price-history')
  async priceHistory(@Param('id') id: string) {
    return this.listingsService.getListingPriceHistory(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/demo-catalog')
  async seedDemoCatalog(@Request() req: any) {
    return this.listingsService.seedDemoCatalogForUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateListingDto, @Request() req: any) {
    return this.listingsService.createForUser(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Post(':id/images')
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
  async uploadImage(
    @Param('id') id: string,
    @Body() dto: UploadListingImageDto,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    return this.listingsService.uploadImageForUser(Number(id), req.user.id, file, dto.isPrimary);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateListingDto, @Request() req: any) {
    return this.listingsService.updateForUser(Number(id), req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.listingsService.removeForUser(Number(id), req.user.id);
  }
}
