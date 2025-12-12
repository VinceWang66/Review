import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SellerEntity } from './entity/seller.entity';
import * as bcrypt from 'bcrypt';  // ← 添加这行，静态导入

@Injectable()
export class SellerService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async seller(username: string, password: string): Promise<SellerEntity> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    
    if (!user) {
      throw new NotFoundException(`"${username}"凭证错误`);
    }

    // 使用静态导入的bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
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