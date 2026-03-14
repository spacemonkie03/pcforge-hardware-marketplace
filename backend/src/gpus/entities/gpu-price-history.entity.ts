import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Gpu } from './gpu.entity';
import { Listing } from '../../listings/entities/listing.entity';

@Entity('gpu_price_history')
@Index('IDX_gpu_price_history_gpu_recorded_at', ['gpu', 'recordedAt'])
export class GpuPriceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Gpu, (gpu) => gpu.priceHistory, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  gpu: Gpu;

  @ManyToOne(() => Listing, (listing) => listing.priceHistory, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  listing: Listing | null;

  @Column({ type: 'integer' })
  price: number;

  @CreateDateColumn({ name: 'recorded_at' })
  recordedAt: Date;
}
