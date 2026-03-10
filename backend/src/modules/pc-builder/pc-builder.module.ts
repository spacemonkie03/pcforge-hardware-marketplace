import { Module } from '@nestjs/common';
import { PcBuilderService } from './pc-builder.service';
import { PcBuilderController } from './pc-builder.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  providers: [PcBuilderService],
  controllers: [PcBuilderController]
})
export class PcBuilderModule {}

