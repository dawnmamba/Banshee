import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard';
import { Roles } from '../user-auth/roles.decorator';
import { RolesGuard } from '../user-auth/roles.guard';
import { UserRole } from '../user-auth/user-role';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class AdminController {
  @Get('dashboard')
  getDashboard(): { message: string } {
    return { message: 'Admin dashboard' };
  }
}
