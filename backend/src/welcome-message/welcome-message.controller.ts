import { Body, Controller, Post } from '@nestjs/common';
import { WelcomeRequestDto } from './dto/welcome-request.dto';
import { WelcomeResponseDto } from './dto/welcome-response.dto';
import { WelcomeMessageService } from './welcome-message.service';

@Controller('welcome')
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
