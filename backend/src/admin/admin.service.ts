import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AdminEntity } from './entity/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async admin(username: string, password: string): Promise<AdminEntity> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user || user.role !== 'admin') {
      throw new NotFoundException(`"${username}"凭证错误`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException(`"${username}"凭证错误`);
    }

    return {
      accessToken: this.jwtService.sign({
        userId: user.uid,
        username: user.username,
        role: user.role,
      }),
    };
  }
}