import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Gpu } from '../../gpus/entities/gpu.entity';
import { MarketplaceUser } from './marketplace-user.entity';
import { ListingImage } from './listing-image.entity';
import { GpuPriceHistory } from '../../gpus/entities/gpu-price-history.entity';
import { ListingView } from './listing-view.entity';
import { Wishlist } from './wishlist.entity';
import { ListingPriceHistory } from './listing-price-history.entity';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Gpu, (gpu) => gpu.listings, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'gpu_id' })
  gpu: Gpu;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'text', nullable: true })
  condition: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => MarketplaceUser, (user) => user.listings, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: MarketplaceUser;

  @OneToMany(() => ListingImage, (image) => image.listing, { cascade: true })
  images: ListingImage[];

  @OneToMany(() => GpuPriceHistory, (priceHistory) => priceHistory.listing)
  priceHistory: GpuPriceHistory[];

  @OneToMany(() => ListingView, (view) => view.listing)
  views: ListingView[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.listing)
  wishlists: Wishlist[];

  @OneToMany(() => ListingPriceHistory, (entry) => entry.listing)
  listingPriceHistory: ListingPriceHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
