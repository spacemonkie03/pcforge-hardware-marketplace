import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from './product.entity';

@Entity()
export class PriceHistory extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.priceHistory)
  product: Product;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamp' })
  recordedAt: Date;
}

