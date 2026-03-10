import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Review extends BaseEntity {
  @ManyToOne(() => User, (user) => user.reviews, { eager: true })
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;
}

