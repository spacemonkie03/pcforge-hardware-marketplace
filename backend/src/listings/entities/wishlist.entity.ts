import { CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from './listing.entity';
import { MarketplaceUser } from './marketplace-user.entity';

@Entity('wishlists')
@Index('IDX_wishlists_user_listing', ['user', 'listing'], { unique: true })
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MarketplaceUser, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: MarketplaceUser;

  @ManyToOne(() => Listing, (listing) => listing.wishlists, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
