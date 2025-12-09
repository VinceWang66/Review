import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from './admin.module';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { userId: number }) {
    const uid = Number(payload.userId);
    if (Number.isNaN(uid)) {
      throw new UnauthorizedException('无效的用户标识');
    }
    const user = await this.usersService.findOne(uid);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      userId: user.uid,
      username: user.username,
      role: user.role,
      isseller: user.isseller,
      email: user.email,
    };
  }
}