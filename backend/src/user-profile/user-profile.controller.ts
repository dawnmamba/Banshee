import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../user-auth/user-auth.service';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { UserProfileService } from './user-profile.service';

type AuthenticatedRequest = Request & { user: AuthUser };

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  get(@Req() req: AuthenticatedRequest) {
    return this.userProfileService.getProfile(req.user.id);
  }

  @Patch('account')
  updateAccount(
    @Req() req: AuthenticatedRequest,
    @Body() body: UpdateAccountDto,
  ) {
    return this.userProfileService.updateAccount(req.user.id, body);
  }

  @Patch('personal')
  updatePersonal(
    @Req() req: AuthenticatedRequest,
    @Body() body: UpdatePersonalDto,
  ) {
    return this.userProfileService.updatePersonal(req.user.id, body);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() body: ChangePasswordDto,
  ) {
    return this.userProfileService.changePassword(req.user.id, body);
  }
}
