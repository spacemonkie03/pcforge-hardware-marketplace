import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  async listForUser(userId: string) {
    return [];
  }
}

