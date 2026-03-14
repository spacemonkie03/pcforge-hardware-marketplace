import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Gpu } from '../../gpus/entities/gpu.entity';
import { Seller } from '../../sellers/entities/seller.entity';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  condition?: string;

  @Column({ type: 'boolean', default: true, name: 'in_stock' })
  inStock: boolean;

  @ManyToOne(() => Gpu, (gpu) => gpu.listings, { eager: true, nullable: false })
  gpu: Gpu;

  @ManyToOne(() => Seller, { eager: true, nullable: false })
  seller: Seller;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
