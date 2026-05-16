import { Module } from '@nestjs/common';
import { UserAuthModule } from '../user-auth/user-auth.module';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';

@Module({
  imports: [UserAuthModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
