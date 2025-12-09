import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger('JwtAuthGuard');

  canActivate(context: ExecutionContext) {
    this.logger.log('🔵 JwtAuthGuard 被触发');
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    this.logger.log('🔵 JwtAuthGuard.handleRequest 执行');
    if (err || !user) {
      this.logger.error('JwtAuthGuard 认证失败:', err?.message);
      throw err;
    }
    this.logger.log('🔵 JwtAuthGuard 认证成功，用户:', user.username);
    return user;
  }
}