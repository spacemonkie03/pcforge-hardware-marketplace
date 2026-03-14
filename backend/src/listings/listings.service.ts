import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { Gpu } from '../gpus/entities/gpu.entity';
import { ListingImage } from './entities/listing-image.entity';
import { GpuPriceHistory } from '../gpus/entities/gpu-price-history.entity';
import { ListingView } from './entities/listing-view.entity';
import { Wishlist } from './entities/wishlist.entity';
import { ListingPriceHistory } from './entities/listing-price-history.entity';
import { MarketplaceUsersService } from './marketplace-users.service';
import { UpdateListingDto } from './dto/update-listing.dto';
import { MarketplaceUser } from './entities/marketplace-user.entity';
import * as jwt from 'jsonwebtoken';
import { ImageStorageService } from '../modules/image-storage/image-storage.service';

interface ListingFilters {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
}

const DEMO_LISTING_DESCRIPTION_PREFIX = 'Demo listing seeded automatically for marketplace preview.';
const DEMO_LISTING_CONDITIONS = [
  'Used - Like New',
  'Used - Excellent',
  'Used - Good',
];

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
    @InjectRepository(ListingImage)
    private readonly listingImageRepo: Repository<ListingImage>,
    @InjectRepository(Gpu)
    private readonly gpuRepo: Repository<Gpu>,
    @InjectRepository(GpuPriceHistory)
    private readonly gpuPriceHistoryRepo: Repository<GpuPriceHistory>,
    @InjectRepository(ListingView)
    private readonly listingViewRepo: Repository<ListingView>,
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,
    @InjectRepository(ListingPriceHistory)
    private readonly listingPriceHistoryRepo: Repository<ListingPriceHistory>,
    @InjectRepository(MarketplaceUser)
    private readonly marketplaceUserRepo: Repository<MarketplaceUser>,
    private readonly marketplaceUsersService: MarketplaceUsersService,
    private readonly imageStorageService: ImageStorageService,
  ) {}

  async findAll(filters: ListingFilters = {}) {
    const qb = this.listingRepo
      .createQueryBuilder('listing')
      .innerJoinAndSelect('listing.gpu', 'gpu')
      .innerJoinAndSelect('listing.user', 'user')
      .leftJoinAndSelect('listing.images', 'images')
      .orderBy('listing.createdAt', 'DESC')
      .addOrderBy('images.sortOrder', 'ASC')
      .addOrderBy('images.id', 'ASC');

    if (filters.q?.trim()) {
      qb.andWhere(
        '(gpu.name ILIKE :q OR gpu.manufacturer ILIKE :q OR gpu.slug ILIKE :q)',
        { q: `%${filters.q.trim()}%` }
      );
    }

    if (typeof filters.minPrice === 'number' && !Number.isNaN(filters.minPrice)) {
      qb.andWhere('listing.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (typeof filters.maxPrice === 'number' && !Number.isNaN(filters.maxPrice)) {
      qb.andWhere('listing.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    const listings = await qb.getMany();
    return listings.map((listing) => this.toListItem(listing));
  }

  async findOne(id: number) {
    const listing = await this.listingRepo.findOne({
      where: { id },
      relations: {
        gpu: true,
        user: true,
        images: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return this.toDetailItem(listing);
  }

  async findOneAndTrackView(id: number, authorizationHeader?: string) {
    const listing = await this.listingRepo.findOne({
      where: { id },
      relations: {
        gpu: true,
        user: true,
        images: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    await this.trackView(listing, authorizationHeader);

    return this.toDetailItem(listing);
  }

  async createForUser(userId: string, dto: CreateListingDto) {
    const gpu = await this.gpuRepo.findOne({ where: { id: dto.gpuId } });
    if (!gpu) {
      throw new NotFoundException('GPU reference not found');
    }

    const marketplaceUser = await this.marketplaceUsersService.ensureByAuthUserId(userId);

    const listing = this.listingRepo.create({
      gpu,
      user: marketplaceUser,
      price: dto.price,
      condition: dto.condition,
      description: dto.description,
      images: (dto.images || []).map((imageUrl, index) =>
        this.listingImageRepo.create({
          imageUrl,
          isPrimary: index === 0,
          sortOrder: index,
        })
      ),
    });

    const savedListing = await this.listingRepo.save(listing);

    await this.gpuPriceHistoryRepo.save(
      this.gpuPriceHistoryRepo.create({
        gpu,
        listing: savedListing,
        price: dto.price,
      })
    );

    return this.findOne(savedListing.id);
  }

  async seedDemoCatalogForUser(userId: string) {
    const marketplaceUser = await this.marketplaceUsersService.ensureByAuthUserId(userId);
    const gpus = await this.gpuRepo.find({
      order: {
        releaseYear: 'DESC',
        manufacturer: 'ASC',
        name: 'ASC',
      },
    });

    const existingListings = await this.listingRepo.find({
      where: {
        user: { id: marketplaceUser.id },
      } as any,
      relations: {
        gpu: true,
        images: true,
        user: true,
      },
    });

    const existingByGpuId = new Map(existingListings.map((listing) => [listing.gpu.id, listing]));

    let created = 0;
    let updated = 0;

    for (const gpu of gpus) {
      const description = this.buildDemoDescription(gpu);
      const condition = DEMO_LISTING_CONDITIONS[gpu.id % DEMO_LISTING_CONDITIONS.length];
      const price = this.estimateDemoPrice(gpu);
      const images = this.buildDemoImageUrls(gpu);
      const existing = existingByGpuId.get(gpu.id);

      if (existing) {
        existing.price = price;
        existing.condition = condition;
        existing.description = description;
        existing.images = images.map((imageUrl, index) =>
          this.listingImageRepo.create({
            listing: existing,
            imageUrl,
            isPrimary: index === 0,
            sortOrder: index,
          })
        );

        await this.listingImageRepo.delete({ listing: { id: existing.id } as any });
        const savedListing = await this.listingRepo.save(existing);
        await this.gpuPriceHistoryRepo.save(
          this.gpuPriceHistoryRepo.create({
            gpu,
            listing: savedListing,
            price,
          })
        );
        updated += 1;
        continue;
      }

      const listing = this.listingRepo.create({
        gpu,
        user: marketplaceUser,
        price,
        condition,
        description,
        images: images.map((imageUrl, index) =>
          this.listingImageRepo.create({
            imageUrl,
            isPrimary: index === 0,
            sortOrder: index,
          })
        ),
      });

      const savedListing = await this.listingRepo.save(listing);
      await this.gpuPriceHistoryRepo.save(
        this.gpuPriceHistoryRepo.create({
          gpu,
          listing: savedListing,
          price,
        })
      );
      created += 1;
    }

    const listings = await this.listingRepo.find({
      where: {
        user: { id: marketplaceUser.id },
      } as any,
      relations: {
        gpu: true,
        user: true,
        images: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      created,
      updated,
      total: listings.length,
      seller: {
        id: marketplaceUser.id,
        name: marketplaceUser.name,
      },
      listings: listings.map((listing) => this.toListItem(listing)),
    };
  }

  async updateForUser(id: number, userId: string, dto: UpdateListingDto) {
    const listing = await this.listingRepo.findOne({
      where: { id },
      relations: {
        user: true,
        images: true,
        gpu: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.user.id !== userId) {
      throw new ForbiddenException('You do not own this listing');
    }

    if (typeof dto.price === 'number' && dto.price !== listing.price) {
      await this.listingPriceHistoryRepo.save(
        this.listingPriceHistoryRepo.create({
          listing,
          price: listing.price,
        })
      );
      listing.price = dto.price;
    }

    if (dto.condition !== undefined) {
      listing.condition = dto.condition;
    }

    if (dto.description !== undefined) {
      listing.description = dto.description;
    }

    if (dto.images) {
      await this.deleteListingImagesFromDisk(listing.images || []);
      await this.listingImageRepo.delete({ listing: { id: listing.id } as any });
      listing.images = dto.images.map((imageUrl, index) =>
        this.listingImageRepo.create({
          listing,
          imageUrl,
          isPrimary: index === 0,
          sortOrder: index,
        })
      );
    }

    await this.listingRepo.save(listing);

    return this.findOne(listing.id);
  }

  async uploadImageForUser(id: number, userId: string, file: Express.Multer.File, isPrimary = false) {
    const listing = await this.listingRepo.findOne({
      where: { id },
      relations: {
        user: true,
        images: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.user.id !== userId) {
      throw new ForbiddenException('You do not own this listing');
    }

    const storedImage = await this.imageStorageService.saveImage(file, 'listings');
    const currentImages = [...(listing.images || [])].sort((a, b) => a.sortOrder - b.sortOrder);
    const shouldBePrimary = isPrimary || currentImages.length === 0;

    if (shouldBePrimary) {
      for (const image of currentImages) {
        image.isPrimary = false;
      }
      await this.listingImageRepo.save(currentImages);
    }

    const image = this.listingImageRepo.create({
      listing,
      imageUrl: storedImage.imageUrl,
      isPrimary: shouldBePrimary,
      sortOrder: currentImages.length,
    });

    const savedImage = await this.listingImageRepo.save(image);

    return {
      id: savedImage.id,
      listingId: listing.id,
      imageUrl: savedImage.imageUrl,
      isPrimary: savedImage.isPrimary,
    };
  }

  async removeForUser(id: number, userId: string) {
    const listing = await this.listingRepo.findOne({
      where: { id },
      relations: {
        user: true,
        images: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.user.id !== userId) {
      throw new ForbiddenException('You do not own this listing');
    }

    await this.deleteListingImagesFromDisk(listing.images || []);
    await this.listingRepo.remove(listing);
    return { deleted: true };
  }

  async getAnalyticsForUser(userId: string) {
    const raw = await this.listingRepo
      .createQueryBuilder('listing')
      .innerJoin('listing.gpu', 'gpu')
      .leftJoin('listing.views', 'view')
      .leftJoin('listing.wishlists', 'wishlist')
      .where('listing.user_id = :userId', { userId })
      .select('listing.id', 'listing_id')
      .addSelect('gpu.name', 'gpu_name')
      .addSelect('listing.price', 'price')
      .addSelect('listing.condition', 'condition')
      .addSelect('listing.created_at', 'created_at')
      .addSelect('COUNT(DISTINCT view.id)', 'views')
      .addSelect('COUNT(DISTINCT wishlist.id)', 'saves')
      .groupBy('listing.id')
      .addGroupBy('gpu.name')
      .addGroupBy('listing.price')
      .addGroupBy('listing.condition')
      .addGroupBy('listing.created_at')
      .orderBy('listing.created_at', 'DESC')
      .getRawMany();

    return raw.map((row) => ({
      listingId: Number(row.listing_id),
      gpuName: row.gpu_name,
      price: Number(row.price),
      condition: row.condition,
      views: Number(row.views || 0),
      saves: Number(row.saves || 0),
      createdAt: row.created_at,
    }));
  }

  async getListingPriceHistory(id: number) {
    const listing = await this.listingRepo.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const entries = await this.listingPriceHistoryRepo.find({
      where: {
        listing: { id },
      } as any,
      order: {
        recordedAt: 'ASC',
      },
    });

    return entries.map((entry) => ({
      id: entry.id,
      price: entry.price,
      recordedAt: entry.recordedAt,
    }));
  }

  async getSellerProfile(userId: string) {
    const seller = await this.marketplaceUserRepo.findOne({
      where: { id: userId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    const listings = await this.listingRepo.find({
      where: {
        user: { id: seller.id },
      } as any,
      relations: {
        gpu: true,
        user: true,
        images: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      id: seller.id,
      name: seller.name,
      role: seller.role,
      joinedAt: seller.createdAt,
      totalListings: listings.length,
      listings: listings.map((listing) => this.toListItem(listing)),
    };
  }

  private toListItem(listing: Listing) {
    const images = [...(listing.images || [])].sort((a, b) => {
      if (a.isPrimary !== b.isPrimary) {
        return a.isPrimary ? -1 : 1;
      }
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.id - b.id;
    });

    return {
      id: listing.id,
      gpuName: listing.gpu.name,
      slug: listing.gpu.slug,
      manufacturer: listing.gpu.manufacturer,
      price: listing.price,
      condition: listing.condition,
      isDemoSeed: this.isDemoSeed(listing),
      firstImage: images[0]?.imageUrl || null,
      createdAt: listing.createdAt,
      seller: {
        id: listing.user.id,
        name: listing.user.name,
      },
    };
  }

  private toDetailItem(listing: Listing) {
    const images = [...(listing.images || [])].sort((a, b) => {
      if (a.isPrimary !== b.isPrimary) {
        return a.isPrimary ? -1 : 1;
      }
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.id - b.id;
    });

    return {
      ...this.toListItem({ ...listing, images }),
      description: listing.description,
      images: images.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
        isPrimary: image.isPrimary,
      })),
      gpu: {
        id: listing.gpu.id,
        name: listing.gpu.name,
        slug: listing.gpu.slug,
        manufacturer: listing.gpu.manufacturer,
        architecture: listing.gpu.architecture,
        releaseYear: listing.gpu.releaseYear,
        processNm: listing.gpu.processNm,
        vramGb: listing.gpu.vramGb,
        memoryType: listing.gpu.memoryType,
        memoryBusWidth: listing.gpu.memoryBusWidth,
        pcieVersion: listing.gpu.pcieVersion,
        tdpWatts: listing.gpu.tdpWatts,
      },
    };
  }

  private isDemoSeed(listing: Listing) {
    return Boolean(
      listing.description?.startsWith(DEMO_LISTING_DESCRIPTION_PREFIX)
    );
  }

  private async trackView(listing: Listing, authorizationHeader?: string) {
    let viewer = null;

    const token = authorizationHeader?.startsWith('Bearer ')
      ? authorizationHeader.slice('Bearer '.length)
      : undefined;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwt') as { sub?: string };
        if (payload?.sub) {
          viewer = await this.marketplaceUsersService.ensureByAuthUserId(payload.sub);
        }
      } catch {
        viewer = null;
      }
    }

    await this.listingViewRepo.save(
      this.listingViewRepo.create({
        listing,
        viewer,
      })
    );
  }

  private estimateDemoPrice(gpu: Gpu) {
    const releaseFactor = Math.max(0, (gpu.releaseYear || new Date().getFullYear()) - 2016) * 1800;
    const vramFactor = (gpu.vramGb || 6) * 1650;
    const busFactor = Math.round((gpu.memoryBusWidth || 128) * 22);
    const tdpFactor = Math.round((gpu.tdpWatts || 120) * 18);
    const manufacturerFactor = gpu.manufacturer?.toLowerCase() === 'nvidia' ? 4500 : 2800;

    return Math.max(7999, Math.round((releaseFactor + vramFactor + busFactor + tdpFactor + manufacturerFactor) / 500) * 500);
  }

  private buildDemoDescription(gpu: Gpu) {
    const year = gpu.releaseYear ? `Released in ${gpu.releaseYear}. ` : '';
    const vram = gpu.vramGb ? `${gpu.vramGb}GB ${gpu.memoryType || 'VRAM'}. ` : '';
    const tdp = gpu.tdpWatts ? `${gpu.tdpWatts}W board power. ` : '';

    return `${DEMO_LISTING_DESCRIPTION_PREFIX} ${year}${vram}${tdp}Remove or replace this listing once your real stock is ready to ship.`.trim();
  }

  private buildDemoImageUrls(gpu: Gpu) {
    return [
      `https://placehold.co/1200x900/0f172a/e2e8f0.webp?text=${encodeURIComponent(gpu.name)}`,
      `https://placehold.co/1200x900/111827/60a5fa.webp?text=${encodeURIComponent(`${gpu.manufacturer} ${gpu.slug}`)}`,
    ];
  }

  private async deleteListingImagesFromDisk(images: ListingImage[]) {
    await Promise.all(images.map((image) => this.imageStorageService.deleteLocalImageByUrl(image.imageUrl)));
  }
}
