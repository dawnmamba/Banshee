import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard';
import { Roles } from '../user-auth/roles.decorator';
import { RolesGuard } from '../user-auth/roles.guard';
import { UserRole } from '../user-auth/user-role';
import { TransactionHistoryImportService } from './transaction-history-import.service';

@Controller('admin/transaction-import')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class TransactionHistoryImportController {
  constructor(
    private readonly importService: TransactionHistoryImportService,
  ) {}

  @Post()
  import(@Body() body: unknown) {
    return this.importService.importFromPayload(body);
  }

  @Get('summary')
  getSummary() {
    return this.importService.getSummary();
  }

  @Get('customers/:customerId/transactions')
  getTransactions(@Param('customerId') customerId: string) {
    return this.importService.getTransactions(customerId);
  }
}
