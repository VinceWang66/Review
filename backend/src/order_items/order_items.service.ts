import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { PrismaService  } from 'src/prisma/prisma.service';

@Injectable()
export class OrderItemsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.orderItem.findMany();
  }

  findOne(id: number) {
    return this.prisma.orderItem.findUnique({ where: { oiid: id } });
  }
}
