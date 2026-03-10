import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Seller } from '../../sellers/entities/seller.entity';
import { Review } from '../../reviews/entities/review.entity';
import { PriceHistory } from './price-history.entity';

export enum ProductCategory {
  GPU = 'GPU',
  CPU = 'CPU',
  MOTHERBOARD = 'MOTHERBOARD',
  RAM = 'RAM',
  STORAGE = 'STORAGE',
  PSU = 'PSU',
  COOLER = 'COOLER',
  CASE = 'CASE',
  FAN = 'FAN',
  ACCESSORY = 'ACCESSORY'
}

@Entity()
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ type: 'enum', enum: ProductCategory })
  category: ProductCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'jsonb', nullable: true })
  specs: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  compatibility: {
    cpuSocket?: string;
    motherboardSocket?: string;
    ramType?: string;
    psuWattage?: number;
    gpuLengthMm?: number;
    caseGpuMaxLengthMm?: number;
  };

  @Column({ default: true })
  inStock: boolean;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @ManyToOne(() => Seller, (seller) => seller.products, { eager: true })
  seller: Seller;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => PriceHistory, (ph) => ph.product)
  priceHistory: PriceHistory[];
}

