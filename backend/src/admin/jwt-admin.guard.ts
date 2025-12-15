// src/seller/jwt-admin.guard.ts
import { Injectable, ExecutionContext, Logger, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger('JwtAdminGuard');  // ← 改日志名

  canActivate(context: ExecutionContext) {
    this.logger.log('🔴 JwtAdminGuard 被触发');
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    this.logger.log('🔴 JwtAdminGuard.handleRequest 执行');
    
    if (err || !user) {
      this.logger.error('JwtAdminGuard 认证失败:', err?.message);
      throw err || new ForbiddenException('请先登录');
    }
    
    // 检查是否是管理员（不是检查商家！）
    this.logger.log('🔴 检查用户权限:', {
      username: user.username,
      role: user.role,
    });
    
    // 修改这里：检查管理员权限
    if (user.role !== 'admin') {  // ← 改为检查admin
      this.logger.error('🔴 用户不是管理员，抛出 ForbiddenException');
      throw new ForbiddenException('需要管理员权限');
    }
    
    this.logger.log('🔴 JwtAdminGuard 认证成功');
    return user;
  }
}