import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { PrismaService } from './../prisma/prisma.service';
  import { JwtService } from '@nestjs/jwt';
  import { SellerEntity } from './entity/seller.entity';
  
  @Injectable()
  export class SellerService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async seller(username: string, password: string): Promise<SellerEntity> {
      const user = await this.prisma.user.findUnique({ where: { username } });
      let isPasswordValid = false;
      if (user && (user.password.startsWith('$2b$') || user.password.startsWith('$2a$'))) {
        isPasswordValid = await (await import('bcrypt')).compare(password, user.password);
      } else if (user) {
        isPasswordValid = user.password === password;
      }
      if (!user || !isPasswordValid) {
        throw new NotFoundException(`"${username}"凭证错误`);
      }
      if (!user.isseller && user.role !== 'seller') {
        throw new UnauthorizedException(`"${username}"不是商家`);
      }
      return {
        accessToken: this.jwtService.sign({
          userId: user.uid,
          username: user.username,
          role: user.role,
          isseller: user.isseller || user.role === 'seller',
        }),
      };
    }
  }