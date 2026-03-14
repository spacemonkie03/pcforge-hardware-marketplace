import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserRole } from '../../common/enums/role.enum';
import { Listing } from './listing.entity';
import { Wishlist } from './wishlist.entity';
import { ListingView } from './listing-view.entity';

@Entity('users')
export class MarketplaceUser {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Listing, (listing) => listing.user)
  listings: Listing[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];

  @OneToMany(() => ListingView, (view) => view.viewer)
  views: ListingView[];
}
