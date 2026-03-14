import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Address extends BaseEntity {
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column()
  line1: string;

  @Column({ nullable: true })
  line2?: string | null;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column({ default: 'India' })
  country: string;

  @Column({ nullable: true })
  landmark?: string | null;

  @Column({ nullable: true })
  label?: string | null;

  @Column({ default: false })
  isDefault: boolean;
}
