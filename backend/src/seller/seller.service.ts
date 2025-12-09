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

        const user = await this.prisma.user.findUnique({ where: { username: username } });
  
      
      if (!user||user.password !== password) {
        throw new NotFoundException(`"${username}"凭证错误`);
      }
      
      if(!user.isseller) {
        throw new UnauthorizedException(`"${username}"不是商家`);
      }
  
      return {
        accessToken: this.jwtService.sign({ 
          userId: user.uid,
          username: user.username,
          isseller: true
        }),
      };
    }
  }