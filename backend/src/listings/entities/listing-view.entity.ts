import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from './listing.entity';
import { MarketplaceUser } from './marketplace-user.entity';

@Entity('listing_views')
export class ListingView {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Listing, (listing) => listing.views, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing;

  @ManyToOne(() => MarketplaceUser, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'viewer_id' })
  viewer: MarketplaceUser | null;

  @CreateDateColumn({ name: 'viewed_at' })
  viewedAt: Date;
}
