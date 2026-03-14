import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>
  ) {}

  async listForUser(userId: string) {
    return this.addressRepo.find({
      where: { user: { id: userId } } as any,
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async createForUser(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.clearDefaultForUser(userId);
    }

    const address = this.addressRepo.create({
      ...dto,
      country: dto.country || 'India',
      user: { id: userId } as any,
    });

    return this.addressRepo.save(address);
  }

  async updateForUser(id: string, userId: string, dto: UpdateAddressDto) {
    const address = await this.requireOwnedAddress(id, userId);

    if (dto.isDefault) {
      await this.clearDefaultForUser(userId);
    }

    Object.assign(address, dto);
    if (dto.country === undefined && !address.country) {
      address.country = 'India';
    }

    return this.addressRepo.save(address);
  }

  async removeForUser(id: string, userId: string) {
    const address = await this.requireOwnedAddress(id, userId);
    await this.addressRepo.remove(address);
    return { deleted: true };
  }

  async findDefaultForUser(userId: string) {
    return this.addressRepo.findOne({
      where: { user: { id: userId }, isDefault: true } as any,
    });
  }

  async findByIdForUser(id: string, userId: string) {
    return this.requireOwnedAddress(id, userId);
  }

  private async requireOwnedAddress(id: string, userId: string) {
    const address = await this.addressRepo.findOne({
      where: { id, user: { id: userId } } as any,
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  private async clearDefaultForUser(userId: string) {
    await this.addressRepo.update({ user: { id: userId } as any }, { isDefault: false });
  }
}
