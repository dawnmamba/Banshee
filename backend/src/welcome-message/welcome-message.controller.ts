import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard';
import { WelcomeRequestDto } from './dto/welcome-request.dto';
import { WelcomeResponseDto } from './dto/welcome-response.dto';
import { WelcomeMessageService } from './welcome-message.service';

@Controller('welcome')
@UseGuards(JwtAuthGuard)
export class WelcomeMessageController {
  constructor(private readonly welcomeMessageService: WelcomeMessageService) {}

  @Post()
  createWelcome(@Body() body: WelcomeRequestDto): WelcomeResponseDto {
    const message = this.welcomeMessageService.buildMessage(
      body.firstName,
      body.lastName,
    );
    return { message };
  }
}
