import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async list(@Request() req: any) {
    return this.cartService.listForUser(req.user.id);
  }

  @Post('items')
  async add(@Request() req: any, @Body() dto: AddCartItemDto) {
    return this.cartService.addForUser(req.user.id, dto);
  }

  @Patch('items/:id')
  async update(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateForUser(id, req.user.id, dto);
  }

  @Delete('items/:id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.cartService.removeForUser(id, req.user.id);
  }

  @Delete('clear')
  async clear(@Request() req: any) {
    return this.cartService.clearForUser(req.user.id);
  }
}
