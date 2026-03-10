import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  async list(@Param('productId') productId: string) {
    return this.reviewsService.findForProduct(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('product/:productId')
  async create(
    @Param('productId') productId: string,
    @Request() req: any,
    @Body() dto: CreateReviewDto
  ) {
    return this.reviewsService.create(productId, req.user.id, dto);
  }
}

