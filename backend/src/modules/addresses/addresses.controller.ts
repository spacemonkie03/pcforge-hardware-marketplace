import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async list(@Request() req: any) {
    return this.addressesService.listForUser(req.user.id);
  }

  @Post()
  async create(@Request() req: any, @Body() dto: CreateAddressDto) {
    return this.addressesService.createForUser(req.user.id, dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateAddressDto) {
    return this.addressesService.updateForUser(id, req.user.id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.addressesService.removeForUser(id, req.user.id);
  }
}
