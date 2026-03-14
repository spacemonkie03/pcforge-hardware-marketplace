import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from './listing.entity';

@Entity('listing_images')
@Index('IDX_listing_images_listing_sort', ['listing', 'sortOrder'])
export class ListingImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Listing, (listing) => listing.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing;

  @Column({ type: 'text', name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'boolean', name: 'is_primary', default: false })
  isPrimary: boolean;

  @Column({ type: 'int', name: 'sort_order', default: 0 })
  sortOrder: number;
}
