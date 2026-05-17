import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { JwtStrategy } from './jwt.strategy';
import { buildJwtModuleOptions } from './jwt-module.options';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => buildJwtModuleOptions(),
    }),
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService, JwtStrategy, RolesGuard],
  exports: [UserAuthService, JwtModule, RolesGuard],
})
export class UserAuthModule {}
