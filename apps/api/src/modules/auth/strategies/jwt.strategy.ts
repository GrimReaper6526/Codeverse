import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@codeverse/database';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'codeverse-default-super-secret-jwt-key-2026',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await UserRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists or session expired');
    }
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
