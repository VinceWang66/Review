import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService  } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({data: createUserDto});
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(uid: number) {
    return this.prisma.user.findUnique({where: { uid }});
  }

  update(uid: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({where: { uid }, data:updateUserDto});
  }

  remove(uid: number) {
    return this.prisma.user.delete({where: { uid }});
  }
}
