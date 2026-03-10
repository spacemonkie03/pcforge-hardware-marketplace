import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller, SellerStatus } from './entities/seller.entity';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepo: Repository<Seller>
  ) {}

  async createForUser(userId: string, name: string): Promise<Seller> {
    const seller = this.sellerRepo.create({
      name,
      user: { id: userId } as any,
      status: SellerStatus.PENDING
    });
    return this.sellerRepo.save(seller);
  }

  async approve(id: string, status: SellerStatus): Promise<Seller> {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException('Seller not found');
    seller.status = status;
    return this.sellerRepo.save(seller);
  }

  async findByUser(userId: string) {
    return this.sellerRepo.find({ where: { user: { id: userId } } as any });
  }

  async analyticsForSeller(sellerId: string) {
    const seller = await this.sellerRepo.findOne({
      where: { id: sellerId },
      relations: ['products']
    });
    if (!seller) throw new NotFoundException('Seller not found');

    const totalProducts = seller.products.length;
    return {
      totalProducts,
      totalSales: 0,
      revenue: 0
    };
  }
}

