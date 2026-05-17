import { Module } from '@nestjs/common';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [UserAuthModule],
  controllers: [AdminController],
})
export class AdminModule {}
