import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { WelcomeMessageModule } from './welcome-message/welcome-message.module';

@Module({
  imports: [HealthModule, WelcomeMessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
