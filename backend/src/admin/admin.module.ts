import { Module } from '@nestjs/common';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [UserAuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
