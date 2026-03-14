import { Controller, Get, Param, Query } from '@nestjs/common';
import { GpusService } from './gpus.service';

@Controller('gpus')
export class GpusController {
  constructor(private readonly gpusService: GpusService) {}

  @Get()
  async list() {
    return this.gpusService.findAll();
  }

  @Get('search')
  async search(@Query('q') q?: string) {
    return this.gpusService.search(q);
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string) {
    return this.gpusService.findBySlug(slug);
  }
}
