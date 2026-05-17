import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../user-auth/user-auth.service';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard';
import { Roles } from '../user-auth/roles.decorator';
import { RolesGuard } from '../user-auth/roles.guard';
import { UserRole } from '../user-auth/user-role';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { AdminUserListService } from './admin-user-list.service';

type AuthenticatedRequest = Request & { user: AuthUser };

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class AdminUserListController {
  constructor(private readonly adminUserListService: AdminUserListService) {}

  @Get()
  async listUsers(@Query() query: ListUsersQueryDto) {
    const users = await this.adminUserListService.listUsers(query.search);
    return { users };
  }

  @Patch(':id/role')
  updateRole(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateUserRoleDto,
  ) {
    return this.adminUserListService.updateUserRole(req.user.id, id, body.role);
  }
}
