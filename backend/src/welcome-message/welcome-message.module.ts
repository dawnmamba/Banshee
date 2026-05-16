import { Module } from '@nestjs/common';
import { WelcomeMessageController } from './welcome-message.controller';
import { WelcomeMessageService } from './welcome-message.service';

@Module({
  controllers: [WelcomeMessageController],
  providers: [WelcomeMessageService],
})
export class WelcomeMessageModule {}
