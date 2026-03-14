import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';
import { GpuPriceHistory } from './gpu-price-history.entity';

@Entity('gpus')
@Index('IDX_gpus_slug', ['slug'], { unique: true })
@Index('IDX_gpus_manufacturer', ['manufacturer'])
@Index('IDX_gpus_vram_gb', ['vramGb'])
export class Gpu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'text' })
  manufacturer: string;

  @Column({ type: 'text', nullable: true })
  architecture: string;

  @Column({ type: 'int', name: 'release_year', nullable: true })
  releaseYear: number;

  @Column({ type: 'int', name: 'process_nm', nullable: true })
  processNm: number;

  @Column({ type: 'int', name: 'vram_gb', nullable: true })
  vramGb: number;

  @Column({ type: 'text', name: 'memory_type', nullable: true })
  memoryType: string;

  @Column({ type: 'int', name: 'memory_bus_width', nullable: true })
  memoryBusWidth: number;

  @Column({ type: 'text', name: 'pcie_version', nullable: true })
  pcieVersion: string;

  @Column({ type: 'int', name: 'tdp_watts', nullable: true })
  tdpWatts: number;

  @OneToMany(() => Listing, (listing) => listing.gpu)
  listings: Listing[];

  @OneToMany(() => GpuPriceHistory, (priceHistory) => priceHistory.gpu)
  priceHistory: GpuPriceHistory[];
}
