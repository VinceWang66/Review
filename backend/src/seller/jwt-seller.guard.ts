import { ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtSellerGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger('JwtSellerGuard');

  canActivate(context: ExecutionContext) {
    this.logger.log('🟡 JwtSellerGuard 被触发');
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    this.logger.log('🟡 JwtSellerGuard.handleRequest 执行');
    
    if (err || !user) {
      this.logger.error('JwtSellerGuard 认证失败:', err?.message);
      throw err || new ForbiddenException('请先登录');
    }
    
    // 检查是否是卖家
    this.logger.log('🟡 检查用户权限:', {
      username: user.username,
      role: user.role,
      isseller: user.isseller
    });
    
    // 修改这里：检查商家权限
    if (!user.isseller && user.role !== 'seller') {
      this.logger.error('🟡 用户不是卖家，抛出 ForbiddenException');
      throw new ForbiddenException('需要商家身份');
    }
    
    this.logger.log('🟡 JwtSellerGuard 认证成功');
    return user;
  }
}