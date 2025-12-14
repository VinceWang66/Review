import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService  } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register-user.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );
    createUserDto.password = hashedPassword;
    const role = (createUserDto.role || 'user').toLowerCase();
    
    try {
      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          role,
          isseller: role === 'seller',
        }
      });
    } catch (error) {
      // 处理唯一键约束错误
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('username')) {
          throw new BadRequestException('用户名已存在');
        }else if (target.includes('email')) {
          throw new BadRequestException('邮箱已存在');
        }else{
          throw new BadRequestException('用户数据已存在');
        }
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        uid: true,
        username: true,
        email: true,
        isseller: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findOne(uid: number) {
    const user = await this.prisma.user.findUnique({
      where: { uid: uid },
      select: { uid: true, username: true, email: true, password: true, isseller: true, role: true, createdAt: true, updatedAt: true },
    })
    if(!user){
      throw new NotFoundException(`用户 ${uid} 不存在`);
    }
    return user;
  }

  async update(uid: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }
    const data: any = { ...updateUserDto };
    if (updateUserDto.role !== undefined) {
      data.isseller = updateUserDto.role === 'seller';
    }
    
    try {
      return await this.prisma.user.update({ 
        where: { uid }, 
        data 
      });
    } catch (error) {
      console.log('Prisma错误详情:', error); // 添加这行
      console.log('错误代码:', error.code);
      console.log('错误meta:', error.meta);
      console.log('错误target:', error.meta?.target);
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('username')) {
          throw new BadRequestException('用户名已存在');
        }else if (target.includes('email')) {
          throw new BadRequestException('邮箱已被注册');
        }else{
          throw new BadRequestException('用户数据已存在');
        }
      }
      throw error;
    }
  }

  remove(uid: number) {
    return this.prisma.user.delete({where: { uid }});
  }
  
  //另外使用register方法确保用户不会自己添加商家选项
  async register(registerDto: RegisterDto) {
    this.validateRegisterData(registerDto);
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // 注册仅普通用户，isseller和role
    try{
      const user= await this.prisma.user.create({
        data: {
          username: registerDto.username,
          password: hashedPassword,
          email: registerDto.email,
          isseller: false,
          role: 'user',
        },
        select: {
          uid: true,
          username: true,
          email: true,
          isseller: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return user;
    }catch(error){
      throw error;
    };
  }
  private validateRegisterData(registerDto: RegisterDto) {
    const { username, password, email } = registerDto;
    
    // 用户名验证
    if (username.length < 2 || username.length > 20) {
      throw new BadRequestException('用户名长度2-20位');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new BadRequestException('用户名格式错误');
    }
    
    // 密码验证
    if (password.length < 6 || password.length > 30) {
      throw new BadRequestException('密码长度6-30位');
    }
    
    // 邮箱验证
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new BadRequestException('邮箱格式错误');
    }
  }
}