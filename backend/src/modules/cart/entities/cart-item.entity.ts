import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Listing } from '../../../listings/entities/listing.entity';

export enum CartItemType {
  PRODUCT = 'PRODUCT',
  LISTING = 'LISTING',
}

@Entity()
export class CartItem extends BaseEntity {
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: CartItemType })
  itemType: CartItemType;

  @ManyToOne(() => Product, { eager: true, nullable: true, onDelete: 'SET NULL' })
  product?: Product | null;

  @ManyToOne(() => Listing, { eager: true, nullable: true, onDelete: 'SET NULL' })
  listing?: Listing | null;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'jsonb', nullable: true })
  snapshot?: Record<string, any> | null;
}
