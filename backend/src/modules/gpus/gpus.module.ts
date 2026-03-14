import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gpu } from './entities/gpu.entity';
import { GpusController } from './gpus.controller';
import { GpusService } from './gpus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gpu])],
  controllers: [GpusController],
  providers: [GpusService],
  exports: [GpusService, TypeOrmModule]
})
export class GpusModule {}
