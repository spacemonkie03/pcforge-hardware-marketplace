import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    private readonly productsService: ProductsService
  ) {}

  async create(productId: string, userId: string, dto: CreateReviewDto) {
    const product = await this.productsService.findOne(productId);
    const review = this.reviewRepo.create({
      product,
      user: { id: userId } as any,
      ...dto
    });
    const saved = await this.reviewRepo.save(review);

    const reviews = await this.reviewRepo.find({
      where: { product: { id: productId } } as any
    });
    const ratingCount = reviews.length;
    const rating =
      ratingCount === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount;
    (product as any).rating = rating;
    (product as any).ratingCount = ratingCount;
    await (this.productsService as any).productRepo.save(product);

    return saved;
  }

  async findForProduct(productId: string) {
    return this.reviewRepo.find({
      where: { product: { id: productId } } as any,
      order: { createdAt: 'DESC' }
    });
  }
}

