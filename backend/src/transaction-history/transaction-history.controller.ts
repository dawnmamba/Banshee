import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../user-auth/user-auth.service';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard';
import { GetTransactionHistoryQueryDto } from './dto/get-transaction-history-query.dto';
import { TransactionHistoryService } from './transaction-history.service';

type AuthenticatedRequest = Request & { user: AuthUser };

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionHistoryController {
  constructor(
    private readonly transactionHistoryService: TransactionHistoryService,
  ) {}

  @Get('history')
  getHistory(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetTransactionHistoryQueryDto,
  ) {
    return this.transactionHistoryService.getHistory(req.user.id, query);
  }
}
