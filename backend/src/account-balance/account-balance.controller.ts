import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../user-auth/user-auth.service';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard';
import { Roles } from '../user-auth/roles.decorator';
import { RolesGuard } from '../user-auth/roles.guard';
import { UserRole } from '../user-auth/user-role';
import { AccountBalanceService } from './account-balance.service';

type AuthenticatedRequest = Request & { user: AuthUser };

@Controller('account')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.User)
export class AccountBalanceController {
  constructor(private readonly accountBalanceService: AccountBalanceService) {}

  @Get('balance')
  getBalance(@Req() req: AuthenticatedRequest) {
    return this.accountBalanceService.getBalance(req.user.id);
  }
}
