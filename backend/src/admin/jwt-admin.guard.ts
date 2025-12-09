import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class JwtAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new ForbiddenException('请先登录');
        }
        if (user.role !== 'admin') {
            throw new ForbiddenException('需要管理员权限');
        }
        return true;
    }
}