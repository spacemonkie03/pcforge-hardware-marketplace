import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller, SellerStatus } from './entities/seller.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../../common/enums/role.enum';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepo: Repository<Seller>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
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

  async ensureApprovedSellerForUser(userId: string): Promise<Seller> {
    const existing = await this.sellerRepo.findOne({
      where: { user: { id: userId } } as any,
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });

    if (existing) {
      if (existing.status !== SellerStatus.APPROVED) {
        existing.status = SellerStatus.APPROVED;
        return this.sellerRepo.save(existing);
      }
      return existing;
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const seller = this.sellerRepo.create({
      name: user.name,
      status: SellerStatus.APPROVED,
      user,
    });

    return this.sellerRepo.save(seller);
  }

  async analyticsForCurrentUser(userId: string) {
    const seller = await this.sellerRepo.findOne({
      where: { user: { id: userId } } as any,
      relations: ['products', 'user'],
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return this.buildAnalyticsPayload(seller);
  }

  async analyticsForSeller(sellerId: string, requesterUserId: string, requesterRole: UserRole) {
    const seller = await this.sellerRepo.findOne({
      where: { id: sellerId },
      relations: ['products', 'user']
    });
    if (!seller) throw new NotFoundException('Seller not found');

    if (requesterRole !== UserRole.ADMIN && seller.user?.id !== requesterUserId) {
      throw new ForbiddenException('You are not allowed to view this seller analytics profile');
    }

    return this.buildAnalyticsPayload(seller);
  }

  private buildAnalyticsPayload(seller: Seller) {
    const totalProducts = seller.products.length;
    return {
      sellerId: seller.id,
      sellerName: seller.name,
      status: seller.status,
      totalProducts,
      totalSales: 0,
      revenue: 0
    };
  }
}

