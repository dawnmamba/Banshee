import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../user-auth/user-auth.service';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard';
import { AccountBalanceService } from './account-balance.service';

type AuthenticatedRequest = Request & { user: AuthUser };

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountBalanceController {
  constructor(private readonly accountBalanceService: AccountBalanceService) {}

  @Get('balance')
  getBalance(@Req() req: AuthenticatedRequest) {
    return this.accountBalanceService.getBalance(req.user.id);
  }
}
