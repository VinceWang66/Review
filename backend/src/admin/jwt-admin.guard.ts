// src/seller/jwt-admin.guard.ts
import { Injectable, ExecutionContext, Logger, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt-admin') {
  private readonly logger = new Logger('JwtSellerGuard');

  canActivate(context: ExecutionContext) {
    this.logger.log('🟡 JwtSellerGuard 被触发');
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    this.logger.log('🟡 JwtSellerGuard.handleRequest 执行');
    
    if (err || !user) {
      this.logger.error('JwtSellerGuard 认证失败:', err?.message);
      throw err;
    }
    
    // 检查是否是卖家
    this.logger.log('🟡 检查用户权限:', {
      username: user.username,
      role: user.role,
      isseller: user.isseller
    });
    
    if (!user.isseller) {
      this.logger.error('🟡 用户不是卖家，抛出 ForbiddenException');
      throw new ForbiddenException('请先登录'); // ← 可能就是这里！
    }
    
    this.logger.log('🟡 JwtSellerGuard 认证成功');
    return user;
  }
}