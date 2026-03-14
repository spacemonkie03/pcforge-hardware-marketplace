import { ForbiddenException, Injectable, NotFoundException, Inject } from '@nestjs/common';
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
import { SellersService } from '../sellers/sellers.service';
import { ProductCategory } from './entities/product.entity';
import { UserRole } from '../../common/enums/role.enum';

interface DemoProductSeed extends CreateProductDto {
  demoKey: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepo: Repository<PriceHistory>,
    @Inject('ELASTIC_CLIENT') private readonly elastic: Client,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly config: ConfigService,
    private readonly sellersService: SellersService
  ) {}

  async create(dto: CreateProductDto, userId: string): Promise<Product> {
    const seller = await this.sellersService.ensureApprovedSellerForUser(userId);
    const product = this.productRepo.create({
      ...dto,
      seller
    });
    const saved = await this.productRepo.save(product);
    await this.addPriceHistory(saved.id, saved.price);
    await this.indexProduct(saved);
    await this.redis.del('products:featured');
    return saved;
  }

  async seedDemoCatalogForUser(userId: string) {
    const seller = await this.sellersService.ensureApprovedSellerForUser(userId);
    const seeds = this.buildDemoCatalog(userId);
    const products: Product[] = [];
    let created = 0;
    let updated = 0;

    for (const seed of seeds) {
      const existing = await this.productRepo.findOne({
        where: {
          name: seed.name,
          category: seed.category,
          seller: { id: seller.id },
        } as any,
      });

      if (existing) {
        const previousPrice = Number(existing.price);
        const nextProduct = await this.productRepo.save({
          ...existing,
          ...seed,
          seller,
        });

        if (previousPrice !== Number(nextProduct.price)) {
          await this.addPriceHistory(nextProduct.id, nextProduct.price);
        }

        await this.indexProduct(nextProduct);
        products.push(nextProduct);
        updated += 1;
        continue;
      }

      const product = this.productRepo.create({
        ...seed,
        seller,
      });
      const saved = await this.productRepo.save(product);
      await this.addPriceHistory(saved.id, saved.price);
      await this.indexProduct(saved);
      products.push(saved);
      created += 1;
    }

    await this.redis.del('products:featured');

    return {
      created,
      updated,
      total: products.length,
      seller: {
        id: seller.id,
        name: seller.name,
      },
      products,
    };
  }

  async update(id: string, dto: UpdateProductDto, userId: string, userRole: UserRole): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['seller', 'seller.user'],
    });
    if (!product) throw new NotFoundException('Product not found');

    if (userRole !== UserRole.ADMIN && product.seller?.user?.id !== userId) {
      throw new ForbiddenException('You do not own this product');
    }

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
    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller');

    if (dto.q) {
      query.andWhere(
        `(
          product.name ILIKE :q OR
          product.brand ILIKE :q OR
          product.category::text ILIKE :q OR
          CAST(product.specs AS text) ILIKE :q
        )`,
        { q: `%${dto.q}%` }
      );
    }

    if (dto.category) {
      query.andWhere('product.category = :category', { category: dto.category });
    }

    if (dto.brand) {
      query.andWhere('product.brand ILIKE :brand', { brand: dto.brand });
    }

    if (dto.minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice: dto.minPrice });
    }

    if (dto.maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: dto.maxPrice });
    }

    if (dto.minRating !== undefined) {
      query.andWhere('product.rating >= :minRating', { minRating: dto.minRating });
    }

    if (dto.inStock !== undefined) {
      query.andWhere('product.inStock = :inStock', { inStock: dto.inStock });
    }

    return query.orderBy('product.createdAt', 'DESC').getMany();
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

  private buildDemoCatalog(userId: string): DemoProductSeed[] {
    const demoCatalog: Array<Omit<DemoProductSeed, 'images' | 'specs'> & { specs: Record<string, any> }> = [
      {
        demoKey: 'cpu-7800x3d',
        name: 'AMD Ryzen 7 7800X3D',
        brand: 'AMD',
        category: ProductCategory.CPU,
        price: 36999,
        inStock: true,
        compatibility: { cpuSocket: 'AM5' },
        specs: { cores: 8, threads: 16, baseClockGHz: 4.2, boostClockGHz: 5.0, tdp: 120, cacheMb: 96, architecture: 'Zen 4' },
      },
      {
        demoKey: 'gpu-4070-super',
        name: 'ASUS Dual GeForce RTX 4070 SUPER OC',
        brand: 'ASUS',
        category: ProductCategory.GPU,
        price: 62999,
        inStock: true,
        compatibility: { psuWattage: 750, gpuLengthMm: 267 },
        specs: { chipset: 'RTX 4070 SUPER', vramGb: 12, vramType: 'GDDR6X', boostClockMHz: 2550, tdp: 220, powerConnectors: '1x 16-pin' },
      },
      {
        demoKey: 'motherboard-b650',
        name: 'MSI MAG B650 Tomahawk WiFi',
        brand: 'MSI',
        category: ProductCategory.MOTHERBOARD,
        price: 22999,
        inStock: true,
        compatibility: { motherboardSocket: 'AM5', ramType: 'DDR5' },
        specs: { chipset: 'B650', formFactor: 'ATX', memorySlots: 4, maxMemoryGb: 192, pcieGeneration: 'PCIe 5.0', m2Slots: 3, sataPorts: 6, wifi: true },
      },
      {
        demoKey: 'ram-ddr5-6000',
        name: 'G.Skill Trident Z5 Neo RGB 32GB DDR5-6000',
        brand: 'G.Skill',
        category: ProductCategory.RAM,
        price: 12499,
        inStock: true,
        compatibility: { ramType: 'DDR5' },
        specs: { capacityGb: 32, sticks: 2, speedMtS: 6000, casLatency: 30, rank: 'Dual Rank', voltage: 1.35, heatspreaderHeightMm: 44, rgb: true },
      },
      {
        demoKey: 'storage-990-pro',
        name: 'Samsung 990 PRO 2TB NVMe SSD',
        brand: 'Samsung',
        category: ProductCategory.STORAGE,
        price: 17999,
        inStock: true,
        compatibility: {},
        specs: { capacityGb: 2000, storageType: 'NVMe SSD', formFactor: 'M.2 2280', interface: 'PCIe 4.0 x4', readSpeedMbps: 7450, writeSpeedMbps: 6900, nandType: 'TLC', dramCache: true, enduranceTbw: 1200 },
      },
      {
        demoKey: 'psu-rm850e',
        name: 'Corsair RM850e ATX 3.0',
        brand: 'Corsair',
        category: ProductCategory.PSU,
        price: 12999,
        inStock: true,
        compatibility: { psuWattage: 850 },
        specs: { efficiency: '80+ Gold', modularity: 'Fully modular', atxVersion: 'ATX 3.0', pcieConnectors: '4x 8-pin, 1x 12VHPWR', fanSizeMm: 120, warrantyYears: 7, cybeneticsNoise: 'A-' },
      },
      {
        demoKey: 'cooler-ls720',
        name: 'DeepCool LS720 360mm AIO Cooler',
        brand: 'DeepCool',
        category: ProductCategory.COOLER,
        price: 10499,
        inStock: true,
        compatibility: { cpuSocket: 'AM5 / LGA1700' },
        specs: { radiatorSizeMm: 360, fanCount: 3, rgb: true, pumpCapDesign: 'Infinity mirror' },
      },
      {
        demoKey: 'case-north',
        name: 'Fractal Design North Charcoal',
        brand: 'Fractal Design',
        category: ProductCategory.CASE,
        price: 13999,
        inStock: true,
        compatibility: { caseGpuMaxLengthMm: 355 },
        specs: { formFactorSupport: 'ATX / Micro-ATX / Mini-ITX', sidePanel: 'Tempered Glass', includedFans: 2, frontPanel: 'Mesh wood hybrid' },
      },
      {
        demoKey: 'fan-p12',
        name: 'ARCTIC P12 PWM PST 5-Pack',
        brand: 'ARCTIC',
        category: ProductCategory.FAN,
        price: 2999,
        inStock: true,
        compatibility: {},
        specs: { fanSizeMm: 120, connector: '4-pin PWM', maxRpm: 1800, airflowCfm: 56.3, quantity: 5 },
      },
      {
        demoKey: 'accessory-gpu-support',
        name: 'Cooler Master ARGB GPU Support Bracket',
        brand: 'Cooler Master',
        category: ProductCategory.ACCESSORY,
        price: 2499,
        inStock: true,
        compatibility: {},
        specs: { accessoryType: 'GPU support bracket', lighting: 'ARGB', material: 'Steel + ABS' },
      },
    ];

    return demoCatalog.map((product) => ({
      ...product,
      images: this.buildDemoImageUrls(product.brand, product.name, product.category),
      specs: {
        ...product.specs,
        marketplaceMeta: {
          demoSeed: true,
          seededByUserId: userId,
          demoKey: product.demoKey,
        },
      },
    }));
  }

  private buildDemoImageUrls(brand: string, name: string, category: ProductCategory) {
    const label = `${brand} ${category}`;
    const title = `${brand} ${name}`;

    return [
      `https://placehold.co/1200x900/111827/f8fafc.webp?text=${encodeURIComponent(title)}`,
      `https://placehold.co/1200x900/1f2937/93c5fd.webp?text=${encodeURIComponent(`${label} Front View`)}`,
    ];
  }
}

