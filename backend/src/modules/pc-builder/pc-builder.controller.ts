import { Body, Controller, Post } from '@nestjs/common';
import { PcBuilderService, PcBuildSelection } from './pc-builder.service';

@Controller('pc-builder')
export class PcBuilderController {
  constructor(private readonly pcBuilderService: PcBuilderService) {}

  @Post('validate')
  async validate(@Body() selection: PcBuildSelection) {
    return this.pcBuilderService.validateBuild(selection);
  }
}

