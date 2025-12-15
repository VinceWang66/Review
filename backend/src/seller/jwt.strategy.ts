import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'zjP9h6ZI5LoSKCRj',
    });
  }

  async validate(payload: any) {
    console.log('Seller策略收到payload:', payload);
    return { uid: payload.uid, username: payload.username, role: payload.role, isseller: payload.isseller };
  }
}