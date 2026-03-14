import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Gpu } from './entities/gpu.entity';

interface GpuSeedRow {
  name: string;
  slug: string;
  manufacturer: string;
  architecture: string;
  release_year: string;
  process_nm: string;
  vram_gb: string;
  memory_type: string;
  memory_bus_width: string;
  pcie_version: string;
  tdp_watts: string;
}

@Injectable()
export class GpusService implements OnModuleInit {
  constructor(
    @InjectRepository(Gpu)
    private readonly gpuRepo: Repository<Gpu>
  ) {}

  async onModuleInit() {
    await this.seedReferenceData();
  }

  async findAll(): Promise<Gpu[]> {
    return this.gpuRepo.find({
      order: {
        manufacturer: 'ASC',
        releaseYear: 'DESC',
        name: 'ASC'
      }
    });
  }

  async findBySlug(slug: string): Promise<Gpu> {
    const gpu = await this.gpuRepo.findOne({ where: { slug } });
    if (!gpu) {
      throw new NotFoundException('GPU not found');
    }
    return gpu;
  }

  private async seedReferenceData() {
    const seedPath = join(process.cwd(), 'database', 'seed', 'gpu_seed_series.csv');
    if (!existsSync(seedPath)) {
      return;
    }

    const csv = readFileSync(seedPath, 'utf8').trim();
    if (!csv) {
      return;
    }

    const [headerLine, ...rows] = csv.split(/\r?\n/);
    const headers = headerLine.split(',');

    const parseNullableInt = (value?: string) => {
      if (!value) {
        return null;
      }

      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const payload = rows
      .map((row) => row.trim())
      .filter(Boolean)
      .map((row) => {
        const values = row.split(',');
        const parsed = headers.reduce<Record<string, string>>((acc, header, index) => {
          acc[header] = values[index]?.trim() ?? '';
          return acc;
        }, {}) as unknown as GpuSeedRow;

        return {
          name: parsed.name,
          slug: parsed.slug,
          manufacturer: parsed.manufacturer,
          architecture: parsed.architecture || null,
          releaseYear: parseNullableInt(parsed.release_year),
          processNm: parseNullableInt(parsed.process_nm),
          vramGb: parseNullableInt(parsed.vram_gb),
          memoryType: parsed.memory_type || null,
          memoryBusWidth: parseNullableInt(parsed.memory_bus_width),
          pcieVersion: parsed.pcie_version || null,
          tdpWatts: parseNullableInt(parsed.tdp_watts),
        };
      });

    if (!payload.length) {
      return;
    }

    await this.gpuRepo
      .createQueryBuilder()
      .insert()
      .into(Gpu)
      .values(payload)
      .orIgnore()
      .execute();
  }
}
