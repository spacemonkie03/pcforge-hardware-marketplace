import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { Gpu } from '../gpus/entities/gpu.entity';
import { ListingImage } from './entities/listing-image.entity';
import { GpuPriceHistory } from '../gpus/entities/gpu-price-history.entity';
import { MarketplaceUser } from './entities/marketplace-user.entity';
import { User } from '../modules/users/entities/user.entity';
import { ListingView } from './entities/listing-view.entity';
import { Wishlist } from './entities/wishlist.entity';
import { ListingPriceHistory } from './entities/listing-price-history.entity';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { MyListingsController } from './my-listings.controller';
import { MarketplaceUsersService } from './marketplace-users.service';
import { ImageStorageModule } from '../modules/image-storage/image-storage.module';

@Module({
  imports: [
    ImageStorageModule,
    TypeOrmModule.forFeature([
      Listing,
      ListingImage,
      Gpu,
      GpuPriceHistory,
      MarketplaceUser,
      User,
      ListingView,
      Wishlist,
      ListingPriceHistory,
    ]),
  ],
  controllers: [ListingsController, WishlistController, MyListingsController],
  providers: [ListingsService, WishlistService, MarketplaceUsersService],
  exports: [ListingsService, WishlistService, MarketplaceUsersService, TypeOrmModule],
})
export class ListingsModule {}
