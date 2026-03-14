import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { Listing } from '../../../listings/entities/listing.entity';

export enum OrderItemType {
  PRODUCT = 'PRODUCT',
  LISTING = 'LISTING',
}

@Entity()
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @Column({ type: 'enum', enum: OrderItemType, default: OrderItemType.PRODUCT })
  itemType: OrderItemType;

  @ManyToOne(() => Product, { eager: true, nullable: true, onDelete: 'SET NULL' })
  product?: Product | null;

  @ManyToOne(() => Listing, { eager: true, nullable: true, onDelete: 'SET NULL' })
  listing?: Listing | null;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  category: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  lineTotal: number;

  @Column({ type: 'jsonb', nullable: true })
  productSnapshot?: Record<string, any> | null;
}
