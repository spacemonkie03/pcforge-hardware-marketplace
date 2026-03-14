import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Listing } from './entities/listing.entity';
import { MarketplaceUsersService } from './marketplace-users.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
    private readonly marketplaceUsersService: MarketplaceUsersService
  ) {}

  async add(userId: string, listingId: number) {
    const user = await this.marketplaceUsersService.ensureByAuthUserId(userId);
    const listing = await this.listingRepo.findOne({ where: { id: listingId } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const existing = await this.wishlistRepo.findOne({
      where: {
        user: { id: user.id },
        listing: { id: listing.id },
      } as any,
    });

    if (existing) {
      return existing;
    }

    return this.wishlistRepo.save(
      this.wishlistRepo.create({
        user,
        listing,
      })
    );
  }

  async remove(userId: string, listingId: number) {
    const entry = await this.wishlistRepo.findOne({
      where: {
        user: { id: userId },
        listing: { id: listingId },
      } as any,
      relations: {
        listing: true,
      },
    });

    if (!entry) {
      return { removed: false };
    }

    await this.wishlistRepo.remove(entry);
    return { removed: true };
  }

  async list(userId: string) {
    const entries = await this.wishlistRepo.find({
      where: {
        user: { id: userId },
      } as any,
      relations: {
        listing: {
          gpu: true,
          user: true,
          images: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return entries.map((entry) => {
      const images = [...(entry.listing.images || [])].sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return a.id - b.id;
      });

      return {
        id: entry.listing.id,
        gpuName: entry.listing.gpu.name,
        slug: entry.listing.gpu.slug,
        manufacturer: entry.listing.gpu.manufacturer,
        price: entry.listing.price,
        condition: entry.listing.condition,
        firstImage: images[0]?.imageUrl || null,
        createdAt: entry.listing.createdAt,
        savedAt: entry.createdAt,
        seller: {
          id: entry.listing.user.id,
          name: entry.listing.user.name,
        },
      };
    });
  }
}
