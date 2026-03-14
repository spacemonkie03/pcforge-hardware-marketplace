import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem, CartItemType } from './entities/cart-item.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Product } from '../products/entities/product.entity';
import { Listing } from '../../listings/entities/listing.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>
  ) {}

  async listForUser(userId: string) {
    const items = await this.cartItemRepo.find({
      where: { user: { id: userId } } as any,
      order: { createdAt: 'DESC' },
    });

    return items.map((item) => this.serialize(item));
  }

  async addForUser(userId: string, dto: AddCartItemDto) {
    if (dto.itemType === CartItemType.PRODUCT && !dto.productId) {
      throw new BadRequestException('productId is required for product cart items');
    }

    if (dto.itemType === CartItemType.LISTING && !dto.listingId) {
      throw new BadRequestException('listingId is required for listing cart items');
    }

    const existing = await this.cartItemRepo.findOne({
      where:
        dto.itemType === CartItemType.PRODUCT
          ? ({ user: { id: userId }, itemType: dto.itemType, product: { id: dto.productId } } as any)
          : ({ user: { id: userId }, itemType: dto.itemType, listing: { id: dto.listingId } } as any),
    });

    if (existing) {
      existing.quantity += dto.quantity;
      return this.serialize(await this.cartItemRepo.save(existing));
    }

    const item = await this.buildCartItem(userId, dto);
    return this.serialize(await this.cartItemRepo.save(item));
  }

  async updateForUser(id: string, userId: string, dto: UpdateCartItemDto) {
    const item = await this.requireOwnedItem(id, userId);
    item.quantity = dto.quantity;
    return this.serialize(await this.cartItemRepo.save(item));
  }

  async removeForUser(id: string, userId: string) {
    const item = await this.requireOwnedItem(id, userId);
    await this.cartItemRepo.remove(item);
    return { deleted: true };
  }

  async clearForUser(userId: string) {
    const items = await this.cartItemRepo.find({ where: { user: { id: userId } } as any });
    if (items.length > 0) {
      await this.cartItemRepo.remove(items);
    }
    return { cleared: true };
  }

  private async buildCartItem(userId: string, dto: AddCartItemDto) {
    if (dto.itemType === CartItemType.PRODUCT) {
      const product = await this.productRepo.findOne({ where: { id: dto.productId }, relations: ['seller'] });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return this.cartItemRepo.create({
        user: { id: userId } as any,
        itemType: CartItemType.PRODUCT,
        product,
        quantity: dto.quantity,
        snapshot: {
          name: product.name,
          brand: product.brand,
          price: Number(product.price),
          category: product.category,
          inStock: product.inStock,
          images: product.images || [],
          sellerName: product.seller?.name || null,
        },
      });
    }

    const listing = await this.listingRepo.findOne({
      where: { id: dto.listingId },
      relations: ['gpu', 'user', 'images'],
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const images = [...(listing.images || [])].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

    return this.cartItemRepo.create({
      user: { id: userId } as any,
      itemType: CartItemType.LISTING,
      listing,
      quantity: dto.quantity,
      snapshot: {
        name: listing.gpu.name,
        brand: listing.gpu.manufacturer,
        price: Number(listing.price),
        category: 'GPU',
        condition: listing.condition,
        sellerName: listing.user.name,
        image: images[0]?.imageUrl || null,
      },
    });
  }

  private async requireOwnedItem(id: string, userId: string) {
    const item = await this.cartItemRepo.findOne({
      where: { id, user: { id: userId } } as any,
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    return item;
  }

  private serialize(item: CartItem) {
    const snapshot = item.snapshot || {};
    const unitPrice =
      item.itemType === CartItemType.PRODUCT
        ? Number(item.product?.price ?? snapshot.price ?? 0)
        : Number(item.listing?.price ?? snapshot.price ?? 0);

    return {
      id: item.id,
      itemType: item.itemType,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
      productId: item.product?.id || null,
      listingId: item.listing?.id || null,
      name: snapshot.name || item.product?.name || item.listing?.gpu?.name || 'Unknown item',
      brand:
        snapshot.brand ||
        item.product?.brand ||
        item.listing?.gpu?.manufacturer ||
        'Unknown brand',
      category: snapshot.category || item.product?.category || 'GPU',
      sellerName: snapshot.sellerName || null,
      condition: snapshot.condition || null,
      image:
        snapshot.image ||
        snapshot.images?.[0] ||
        item.product?.images?.[0] ||
        null,
    };
  }
}
