import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { ListingsService } from './listings.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SELLER, UserRole.ADMIN)
@Controller('my-listings')
export class MyListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get('analytics')
  async analytics(@Request() req: any) {
    return this.listingsService.getAnalyticsForUser(req.user.id);
  }
}
