import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { PrismaService } from './../prisma/prisma.service';
  import { JwtService } from '@nestjs/jwt';
  import { AuthEntity } from './entity/auth.entity';
  import * as bcrypt from 'bcrypt';
  
  @Injectable()
  export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  
    async login(username: string, password: string): Promise<AuthEntity> {
      // Step 1: Fetch a user with the given username
      const user = await this.prisma.user.findUnique({ where: { username: username } });
  
      // If no user is found, throw an error
      if (!user) {
        throw new NotFoundException(`No user found for username: ${username}`);
      }
  
      // Step 2: Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      // If password does not match, throw an error
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
  
      // Step 3: Generate a JWT containing the user's ID and return it
      return {
        accessToken: this.jwtService.sign({ userId: user.uid, role: user.role, isseller: user.isseller }),
      };
    }

    async checkUsernameAvailability(username: string) {
      if (!username || username.trim().length < 2) {
        return { available: false, message: '用户名至少2位' };
      }
      
      const user = await this.prisma.user.findUnique({
        where: { username: username.trim() }
      });
      
      return {
        available: !user,
        message: user ? '用户名已被使用' : '用户名可用'
      };
    }

    async checkEmailAvailability(email: string) {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return { available: false, message: '邮箱格式不正确' };
      }
      
      const user = await this.prisma.user.findUnique({
        where: { email: email.trim() }
      });
      
      return {
        available: !user,
        message: user ? '邮箱已被注册' : '邮箱可用'
      };
    }
  }