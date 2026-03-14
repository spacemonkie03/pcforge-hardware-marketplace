import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { WishlistService } from './wishlist.service';

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async list(@Request() req: any) {
    return this.wishlistService.list(req.user.id);
  }

  @Post(':listingId')
  async add(@Param('listingId') listingId: string, @Request() req: any) {
    return this.wishlistService.add(req.user.id, Number(listingId));
  }

  @Delete(':listingId')
  async remove(@Param('listingId') listingId: string, @Request() req: any) {
    return this.wishlistService.remove(req.user.id, Number(listingId));
  }
}
