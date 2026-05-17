import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserAuthService } from './user-auth.service';
import { UserRole } from './user-role';

export type JwtPayload = { sub: string; email: string; role: UserRole };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userAuthService: UserAuthService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    return this.userAuthService.getProfile(payload.sub);
  }
}
