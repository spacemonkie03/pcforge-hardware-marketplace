import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from './listing.entity';

@Entity('listing_price_history')
export class ListingPriceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Listing, (listing) => listing.listingPriceHistory, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing;

  @Column({ type: 'integer' })
  price: number;

  @CreateDateColumn({ name: 'recorded_at' })
  recordedAt: Date;
}
