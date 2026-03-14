import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PaymentMethod,
  PaymentMethodStatus,
  PaymentMethodType,
} from './entities/payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>
  ) {}

  async listForUser(userId: string) {
    return this.paymentMethodRepo.find({
      where: { user: { id: userId } } as any,
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async createForUser(userId: string, dto: CreatePaymentMethodDto) {
    if (dto.isDefault) {
      await this.clearDefaultForUser(userId);
    }

    const method = this.paymentMethodRepo.create({
      ...dto,
      status: PaymentMethodStatus.ACTIVE,
      user: { id: userId } as any,
    });

    return this.paymentMethodRepo.save(method);
  }

  async updateForUser(id: string, userId: string, dto: UpdatePaymentMethodDto) {
    const method = await this.requireOwnedMethod(id, userId);

    if (dto.isDefault) {
      await this.clearDefaultForUser(userId);
    }

    Object.assign(method, dto);
    return this.paymentMethodRepo.save(method);
  }

  async removeForUser(id: string, userId: string) {
    const method = await this.requireOwnedMethod(id, userId);
    await this.paymentMethodRepo.remove(method);
    return { deleted: true };
  }

  async findByIdForUser(id: string, userId: string) {
    return this.requireOwnedMethod(id, userId);
  }

  getSupportedOptions() {
    return [
      {
        type: PaymentMethodType.UPI,
        providers: ['RAZORPAY', 'PHONEPE', 'GOOGLE_PAY', 'PAYTM'],
        fields: ['upiId'],
      },
      {
        type: PaymentMethodType.CARD,
        providers: ['STRIPE', 'RAZORPAY'],
        fields: ['last4', 'brand', 'expiryMonth', 'expiryYear'],
      },
      {
        type: PaymentMethodType.NET_BANKING,
        providers: ['RAZORPAY', 'PAYU'],
        fields: ['bankCode', 'accountHolder'],
      },
      {
        type: PaymentMethodType.WALLET,
        providers: ['PAYTM', 'AMAZON_PAY'],
        fields: ['walletId'],
      },
      {
        type: PaymentMethodType.COD,
        providers: ['MANUAL'],
        fields: [],
      },
      {
        type: PaymentMethodType.BANK_TRANSFER,
        providers: ['MANUAL'],
        fields: ['accountReference'],
      },
    ];
  }

  private async requireOwnedMethod(id: string, userId: string) {
    const method = await this.paymentMethodRepo.findOne({
      where: { id, user: { id: userId } } as any,
    });

    if (!method) {
      throw new NotFoundException('Payment method not found');
    }

    return method;
  }

  private async clearDefaultForUser(userId: string) {
    await this.paymentMethodRepo.update({ user: { id: userId } as any }, { isDefault: false });
  }
}
