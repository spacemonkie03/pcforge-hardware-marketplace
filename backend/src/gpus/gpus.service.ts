import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Gpu } from './entities/gpu.entity';

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
        name: 'ASC',
      },
    });
  }

  async findBySlug(slug: string): Promise<Gpu> {
    const gpu = await this.gpuRepo.findOne({ where: { slug } });
    if (!gpu) {
      throw new NotFoundException('GPU not found');
    }
    return gpu;
  }

  async search(query?: string): Promise<Gpu[]> {
    const trimmed = query?.trim();

    if (!trimmed) {
      return this.findAll();
    }

    return this.gpuRepo
      .createQueryBuilder('gpu')
      .where('gpu.name ILIKE :q', { q: `%${trimmed}%` })
      .orWhere('gpu.manufacturer ILIKE :q', { q: `%${trimmed}%` })
      .orderBy('gpu.releaseYear', 'DESC')
      .addOrderBy('gpu.name', 'ASC')
      .getMany();
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
        const record = headers.reduce<Record<string, string>>((acc, header, index) => {
          acc[header] = values[index]?.trim() ?? '';
          return acc;
        }, {});

        return {
          name: record.name,
          slug: record.slug,
          manufacturer: record.manufacturer,
          architecture: record.architecture || null,
          releaseYear: parseNullableInt(record.release_year),
          processNm: parseNullableInt(record.process_nm),
          vramGb: parseNullableInt(record.vram_gb),
          memoryType: record.memory_type || null,
          memoryBusWidth: parseNullableInt(record.memory_bus_width),
          pcieVersion: record.pcie_version || null,
          tdpWatts: parseNullableInt(record.tdp_watts),
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
