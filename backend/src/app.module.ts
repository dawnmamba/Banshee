import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { UserAuthModule } from './user-auth/user-auth.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { WelcomeMessageModule } from './welcome-message/welcome-message.module';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    UserAuthModule,
    UserProfileModule,
    WelcomeMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
