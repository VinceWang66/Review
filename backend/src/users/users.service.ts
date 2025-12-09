import { Injectable, NotFoundException } from '@nestjs/common';
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
    // isseller 只在数据入库时动态赋值
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        role,
        isseller: role === 'seller',
      }
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(uid: number) {
    const user = await this.prisma.user.findUnique({
      where: { uid: uid },
      select: { uid: true, username: true, email: true, password: true, isseller: true, role: true },
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
    return this.prisma.user.update({ where: { uid }, data });
  }

  remove(uid: number) {
    return this.prisma.user.delete({where: { uid }});
  }
  
  //另外使用register方法确保用户不会自己添加商家选项
  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    // 注册仅普通用户，isseller和role
    return this.prisma.user.create({
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
      }
    });
  }
}