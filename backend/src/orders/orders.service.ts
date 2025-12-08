import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService){}
  
  async create(createOrderDto: CreateOrderDto) {
    let totalPrice = 0;
    totalPrice= await this.caculate(createOrderDto.items);
    return this.prisma.order.create({
      data:{
        totalAmount:totalPrice,
        userId:createOrderDto.userId
      }
    });
  }

  findAll() {
    return this.prisma.order.findMany();
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({where: { oid: id }});
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    //重新计算总价即可
    let totalPrice = 0;
    if(updateOrderDto.items){
      totalPrice= await this.caculate(updateOrderDto.items);
    }
    return this.prisma.order.update({
      where: {oid: id}, 
      data:{
        totalAmount:totalPrice
      }
    });
  }

  remove(id: number) {
    return this.prisma.order.delete({where: {oid: id}});
  }

  private async caculate(items: OrderItemDto[]):Promise<number>{
    let totalPrice = 0;
    for(const item of items){
      const product = await this.prisma.product.findUnique({where:{ pid: item.productId }})
      if(!product){
        throw new NotFoundException(`商品"${item.productId}"不存在`);
      }
      totalPrice+=product?.price.toNumber()*item.quantity;
    }
    return totalPrice;
  }
}
