import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { PriceHistory } from './entities/price-history.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { Client } from 'elasticsearch';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepo: Repository<PriceHistory>,
    @Inject('ELASTIC_CLIENT') private readonly elastic: Client,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly config: ConfigService
  ) {}

  async create(dto: CreateProductDto, sellerId: string): Promise<Product> {
    const product = this.productRepo.create({
      ...dto,
      seller: { id: sellerId } as any
    });
    const saved = await this.productRepo.save(product);
    await this.addPriceHistory(saved.id, saved.price);
    await this.indexProduct(saved);
    await this.redis.del('products:featured');
    return saved;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    const updated = await this.productRepo.save({ ...product, ...dto });
    if (dto.price !== undefined && dto.price !== product.price) {
      await this.addPriceHistory(updated.id, updated.price);
    }
    await this.indexProduct(updated);
    await this.redis.del('products:featured');
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.productRepo.delete({ id });
    const index = this.config.get('elastic.index');
    await this.elastic.delete({ index, id }).catch(() => null);
  }

  async findAll(): Promise<Product[]> {
    const cacheKey = 'products:featured';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
    const products = await this.productRepo.find({
      order: { createdAt: 'DESC' },
      take: 50
    });
    await this.redis.set(cacheKey, JSON.stringify(products), 'EX', 60);
    return products;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['priceHistory', 'reviews']
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async search(dto: SearchProductsDto) {
    const index = this.config.get('elastic.index');
    const must: any[] = [];
    const filter: any[] = [];

    if (dto.q) {
      must.push({
        multi_match: {
          query: dto.q,
          fields: ['name^2', 'brand', 'category', 'specs.*']
        }
      });
    }

    if (dto.category) filter.push({ term: { category: dto.category } });
    if (dto.brand) filter.push({ term: { brand: dto.brand } });
    if (dto.minPrice || dto.maxPrice) {
      const range: any = {};
      if (dto.minPrice) range.gte = dto.minPrice;
      if (dto.maxPrice) range.lte = dto.maxPrice;
      filter.push({ range: { price: range } });
    }
    if (dto.minRating) {
      filter.push({ range: { rating: { gte: dto.minRating } } });
    }
    if (dto.inStock !== undefined) {
      filter.push({ term: { inStock: dto.inStock } });
    }

    const response = await this.elastic.search({
      index,
      body: {
        query: {
          bool: {
            must: must.length ? must : [{ match_all: {} }],
            filter
          }
        }
      }
    });

    const hits: any[] = (response as any).hits?.hits || [];
    const ids = hits.map((h) => h._id);
    if (!ids.length) return [];
    const products = await this.productRepo.findByIds(ids as any);
    return products;
  }

  private async addPriceHistory(productId: string, price: number) {
    const ph = this.priceHistoryRepo.create({
      product: { id: productId } as any,
      price,
      recordedAt: new Date()
    });
    await this.priceHistoryRepo.save(ph);
  }

  private async indexProduct(product: Product) {
    const index = this.config.get('elastic.index');
    await this.elastic.index({
      index,
      id: product.id,
      body: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        rating: product.rating,
        ratingCount: product.ratingCount,
        inStock: product.inStock,
        specs: product.specs,
        compatibility: product.compatibility
      }
    });
  }
}

