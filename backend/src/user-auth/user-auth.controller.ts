import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthUser, UserAuthService } from './user-auth.service';

type AuthenticatedRequest = Request & { user: AuthUser };

@Controller('auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: RegisterDto) {
    return this.userAuthService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.userAuthService.login(body);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return this.userAuthService.logout();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
