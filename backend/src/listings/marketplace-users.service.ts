import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketplaceUser } from './entities/marketplace-user.entity';
import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class MarketplaceUsersService {
  constructor(
    @InjectRepository(MarketplaceUser)
    private readonly marketplaceUserRepo: Repository<MarketplaceUser>,
    @InjectRepository(User)
    private readonly authUserRepo: Repository<User>
  ) {}

  async ensureByAuthUserId(userId: string) {
    const authUser = await this.authUserRepo.findOne({ where: { id: userId } });

    if (!authUser) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.marketplaceUserRepo.findOne({
      where: { id: authUser.id },
    });

    if (existing) {
      let changed = false;
      if (existing.email !== authUser.email) {
        existing.email = authUser.email;
        changed = true;
      }
      if (existing.name !== authUser.name) {
        existing.name = authUser.name;
        changed = true;
      }
      if (existing.role !== authUser.role) {
        existing.role = authUser.role;
        changed = true;
      }
      if (changed) {
        existing.updatedAt = new Date();
        return this.marketplaceUserRepo.save(existing);
      }
      return existing;
    }

    return this.marketplaceUserRepo.save(
      this.marketplaceUserRepo.create({
        id: authUser.id,
        createdAt: authUser.createdAt,
        updatedAt: authUser.updatedAt,
        email: authUser.email,
        name: authUser.name,
        role: authUser.role,
      })
    );
  }
}
