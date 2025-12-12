import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // 确保导入
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService, // 添加 ConfigService
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'zjP9h6ZI5LoSKCRj', // 从 ConfigService 获取
    });
  }

  async validate(payload: { uid: number; role?: string; isseller?: boolean; username?: string }) {
    const uid = Number(payload.uid);
    if (Number.isNaN(uid)) {
      throw new UnauthorizedException('无效的用户标识');
    }
    const user = await this.usersService.findOne(uid);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log(`uid in strategy "${user.uid}"`)
    return {
      uid: user.uid,
      username: user.username,
      role: user.role,
      isseller: user.isseller,
      email: user.email,
    };
  }
}