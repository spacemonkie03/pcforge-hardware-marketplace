import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem, OrderItemType } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddressesService } from '../addresses/addresses.service';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { Listing } from '../../listings/entities/listing.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
    private readonly addressesService: AddressesService,
    private readonly paymentMethodsService: PaymentMethodsService,
    private readonly cartService: CartService
  ) {}

  async listForUser(userId: string) {
    const orders = await this.orderRepo.find({
      where: { user: { id: userId } } as any,
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => this.serializeOrder(order));
  }

  async createForUser(userId: string, dto: CreateOrderDto) {
    const productIds = dto.items
      .filter((item) => item.itemType === OrderItemType.PRODUCT)
      .map((item) => item.productId!)
      .filter(Boolean);
    const listingIds = dto.items
      .filter((item) => item.itemType === OrderItemType.LISTING)
      .map((item) => item.listingId!)
      .filter(Boolean);

    const [products, listings] = await Promise.all([
      productIds.length > 0
        ? this.productRepo.find({
            where: { id: In(productIds) } as any,
          })
        : Promise.resolve([]),
      listingIds.length > 0
        ? this.listingRepo.find({
            where: { id: In(listingIds) } as any,
            relations: ['gpu', 'user', 'images'],
          })
        : Promise.resolve([]),
    ]);

    const productMap = new Map(products.map((product) => [product.id, product]));
    const listingMap = new Map(listings.map((listing) => [listing.id, listing]));

    const missingProductIds = productIds.filter((productId) => !productMap.has(productId));
    const missingListingIds = listingIds.filter((listingId) => !listingMap.has(listingId));

    if (missingProductIds.length > 0 || missingListingIds.length > 0) {
      throw new NotFoundException(
        [
          missingProductIds.length > 0 ? `Products not found: ${missingProductIds.join(', ')}` : null,
          missingListingIds.length > 0 ? `Listings not found: ${missingListingIds.join(', ')}` : null,
        ]
          .filter(Boolean)
          .join(' | ')
      );
    }

    const orderItems = dto.items.map((item) => {
      if (item.itemType === OrderItemType.PRODUCT) {
        const product = productMap.get(item.productId!)!;
        const unitPrice = Number(product.price);
        const lineTotal = unitPrice * item.quantity;

        return this.orderItemRepo.create({
          itemType: OrderItemType.PRODUCT,
          product,
          name: product.name,
          brand: product.brand,
          category: product.category,
          quantity: item.quantity,
          unitPrice,
          lineTotal,
          productSnapshot: {
            images: product.images,
            specs: product.specs,
            compatibility: product.compatibility,
            sellerId: product.seller?.id || null,
            sellerName: product.seller?.name || null,
          },
        });
      }

      const listing = listingMap.get(item.listingId!)!;
      const unitPrice = Number(listing.price);
      const lineTotal = unitPrice * item.quantity;
      const images = [...(listing.images || [])].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);

      return this.orderItemRepo.create({
        itemType: OrderItemType.LISTING,
        listing,
        name: listing.gpu.name,
        brand: listing.gpu.manufacturer,
        category: 'GPU',
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        productSnapshot: {
          image: images[0]?.imageUrl || null,
          condition: listing.condition,
          sellerId: listing.user.id,
          sellerName: listing.user.name,
          gpuSlug: listing.gpu.slug,
          gpuName: listing.gpu.name,
        },
      });
    });

    const subtotal = orderItems.reduce((sum, item) => sum + Number(item.lineTotal), 0);
    const shippingAmount = dto.shippingAmount ?? 0;
    const taxAmount = dto.taxAmount ?? 0;
    const total = subtotal + shippingAmount + taxAmount;

    if (total < 0) {
      throw new BadRequestException('Order total cannot be negative');
    }

    let shippingAddress = null;
    if (dto.shippingAddressId) {
      shippingAddress = await this.addressesService.findByIdForUser(dto.shippingAddressId, userId);
    }

    let paymentMethod = null;
    if (dto.paymentMethodId) {
      paymentMethod = await this.paymentMethodsService.findByIdForUser(dto.paymentMethodId, userId);
    }

    const order = this.orderRepo.create({
      user: { id: userId } as any,
      shippingAddress,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      currency: 'INR',
      subtotal,
      shippingAmount,
      taxAmount,
      total,
      paymentMethodType: paymentMethod?.type || null,
      paymentProvider: paymentMethod?.provider || null,
      paymentMethodLabel: paymentMethod?.label || null,
      paymentMetadata: {
        paymentMethodId: paymentMethod?.id || null,
        notes: dto.notes || null,
      },
      items: orderItems,
    });

    const saved = await this.orderRepo.save(order);
    if (dto.clearCart) {
      await this.cartService.clearForUser(userId);
    }
    return this.serializeOrder(saved);
  }

  private serializeOrder(order: Order) {
    return {
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      currency: order.currency,
      subtotal: Number(order.subtotal),
      shippingAmount: Number(order.shippingAmount),
      taxAmount: Number(order.taxAmount),
      total: Number(order.total),
      createdAt: order.createdAt,
      paymentMethodType: order.paymentMethodType,
      paymentProvider: order.paymentProvider,
      paymentMethodLabel: order.paymentMethodLabel,
      shippingAddress: order.shippingAddress
        ? {
            id: order.shippingAddress.id,
            fullName: order.shippingAddress.fullName,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            postalCode: order.shippingAddress.postalCode,
            country: order.shippingAddress.country,
          }
        : null,
      items: (order.items || []).map((item) => ({
        id: item.id,
        itemType: item.itemType,
        productId: item.product?.id || null,
        listingId: item.listing?.id || null,
        name: item.name,
        brand: item.brand,
        category: item.category,
        quantity: item.quantity,
        price: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
      })),
    };
  }
}
