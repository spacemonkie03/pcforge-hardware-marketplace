import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';

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

  @Column({ type: 'text' })
  architecture: string;

  @Column({ type: 'int', name: 'release_year' })
  releaseYear: number;

  @Column({ type: 'int', name: 'process_nm' })
  processNm: number;

  @Column({ type: 'int', name: 'vram_gb' })
  vramGb: number;

  @Column({ type: 'text', name: 'memory_type' })
  memoryType: string;

  @Column({ type: 'int', name: 'memory_bus_width' })
  memoryBusWidth: number;

  @Column({ type: 'text', name: 'pcie_version' })
  pcieVersion: string;

  @Column({ type: 'int', name: 'tdp_watts' })
  tdpWatts: number;

  @OneToMany(() => Listing, (listing) => listing.gpu)
  listings: Listing[];
}
