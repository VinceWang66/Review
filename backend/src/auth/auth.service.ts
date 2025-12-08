import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { PrismaService } from './../prisma/prisma.service';
  import { JwtService } from '@nestjs/jwt';
  import { AuthEntity } from './entity/login.entity';
  
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
      const isPasswordValid = user.password === password;
  
      // If password does not match, throw an error
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
  
      // Step 3: Generate a JWT containing the user's ID and return it
      return {
        accessToken: this.jwtService.sign({ userId: user.uid }),
      };
    }
  }