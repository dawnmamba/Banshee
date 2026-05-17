import { Module } from '@nestjs/common';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { AdminUserListController } from './admin-user-list.controller';
import { AdminUserListService } from './admin-user-list.service';

@Module({
  imports: [UserAuthModule],
  controllers: [AdminUserListController],
  providers: [AdminUserListService],
})
export class AdminUserListModule {}
