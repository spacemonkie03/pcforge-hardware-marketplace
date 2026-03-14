import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myOrders(@Request() req: any) {
    return this.ordersService.listForUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(@Request() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createForUser(req.user.id, dto);
  }
}
