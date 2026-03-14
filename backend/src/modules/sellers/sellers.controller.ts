import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UpdateSellerStatusDto } from './dto/update-seller-status.dto';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async apply(@Request() req: any, @Body('name') name: string) {
    return this.sellersService.createForUser(req.user.id, name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async mySellers(@Request() req: any) {
    return this.sellersService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateSellerStatusDto) {
    return this.sellersService.approve(id, dto.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Get('me/analytics')
  async myAnalytics(@Request() req: any) {
    return this.sellersService.analyticsForCurrentUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Get(':id/analytics')
  async analytics(@Param('id') id: string, @Request() req: any) {
    return this.sellersService.analyticsForSeller(id, req.user.id, req.user.role);
  }
}

