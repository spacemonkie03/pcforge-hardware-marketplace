import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../../../common/enums/role.enum';
import { Seller } from '../../sellers/entities/seller.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Seller, (seller) => seller.user)
  sellers: Seller[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}

