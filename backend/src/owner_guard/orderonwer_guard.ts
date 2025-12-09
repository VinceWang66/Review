import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const orderId = parseInt(request.params.id);

    const order = await this.prisma.order.findUnique({
      where: { oid: orderId },
      select: { userId: true }
    });

    if (!order || order.userId !== user.userId) {
      throw new ForbiddenException('只能访问自己的订单');
    }

    return true;
  }
}