import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService  } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/index-browser';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { PurchaseItemDto } from './dto/purchase-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
  ){}
  
  async create(createProductDto: CreateProductDto, sellerId: number) {
    let seller = await this.prisma.user.findUnique({
      where: { uid: sellerId },
      select: { isseller: true, role: true }
    });
    if(!seller||!(seller.isseller||seller.role==='seller')){
      throw new ForbiddenException(`"${sellerId}"不是商家账号（需isseller为true，或role为seller）`)
    }
    
    let category;
    
    // 优先使用categoryId
    if (createProductDto.categoryId) {
      category = await this.prisma.category.findUnique({
        where:{ cid: createProductDto.categoryId }
      });
      if(!category){
        throw new NotFoundException(`分类ID "${createProductDto.categoryId}" 不存在`);
      }
    } 
    // 如果没传categoryId，使用categoryName
    else if (createProductDto.categoryName) {
      category = await this.prisma.category.findUnique({
        where:{ cname: createProductDto.categoryName }
      });
      if(!category){
        throw new NotFoundException(`分类 "${createProductDto.categoryName}" 不存在`);
      }
    }
    // 两个都没传
    else {
      throw new BadRequestException('必须提供分类ID或分类名称');
    }
    
    const { categoryId, categoryName, price, ...restData } = createProductDto;
    
    return this.prisma.product.create({
      data:{
        ...restData,
        price: new Decimal(price),
        categoryId: category.cid,
        sellerId,
      }
    });
}

  async findAll() {
    const products = await this.prisma.product.findMany({
      include:{
        category:{
          select:{
            cname : true
          }
        }
      }
    });
    return products.map(p=>({
      ...p,
      categoryName:p.category?.cname || '无分类'
    }))
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { pid: id },
      include: {
            category: {
                select: {
                    cname: true  // 包含分类名称
                }
            }
        }});
  }

  async update(id: number, updateProductDto: UpdateProductDto, sellerId: number) {
    if (!id) {
      throw new BadRequestException('商品ID不能为空');
    }
    return this.prisma.product.update({where: {pid: id}, data: { ...updateProductDto, sellerId }});
  }

  remove(id: number) {
    return this.prisma.product.delete({where: {pid: id}});
  }

  async purchase(id: number, quantity: number, uid: number){
    if (uid === undefined || uid === null) {
      throw new UnauthorizedException('请先登录');
    }
    const product = await this.prisma.product.findUnique({
      where:{ pid:id }
    })
    if (!product) {
      throw new BadRequestException('商品不存在');
    }
    if (product.stock < quantity) {
      throw new BadRequestException(`库存不足，当前库存: ${product.stock}`);
    }

    return await this.prisma.$transaction(async (prisma) => {
      const updatedProduct = await prisma.product.update({
        where: { pid: id },
        data: { 
          stock: { 
            decrement: quantity 
          },
        }
      });
      // const totalPrice = Number(product.price) * quantity;
      // const order = await prisma.order.create({
      //   data: {
      //     userId: uid,
      //     totalAmount: totalPrice,
      //     status: 'paid'
      //   }
      // });
      // await prisma.orderItem.create({
      //   data: {
      //     orderId: order.oid,
      //     productId: id,
      //     quantity: quantity,
      //   }
      // });
      return {
        success: true,
        message: '购买成功',
        product: { id: product.pid, stock: updatedProduct.stock },
        // order: {
        //   oid: order.oid,
        //   totalAmount: order.totalAmount
        // }
      };
    })
  }

  // async purchaseCart(items: PurchaseItemDto[], uid: number) {
  //   if (uid === undefined || uid === null) {
  //     throw new UnauthorizedException('请先登录');
  //   }
  //   if (!items.length) {
  //     throw new BadRequestException('购物车不能为空');
  //   }
  //   const orderItems: PurchaseItemDto[] = [];
  //   let totalAmount = 0;
  //   for (const item of items) {
  //     const product = await this.prisma.product.findUnique({ where: { pid: item.productId } });
  //     if (!product) {
  //       throw new BadRequestException(`商品ID${item.productId}不存在`);
  //     }
  //     if (product.stock < item.quantity) {
  //       throw new BadRequestException(`商品ID${item.productId}库存不足，目前库存${product.stock}`);
  //     }
  //     orderItems.push({ productId: item.productId, quantity: item.quantity });
  //     totalAmount += Number(product.price) * item.quantity;
  //   }
  //   return await this.prisma.$transaction(async (prisma) => {
  //     const order = await prisma.order.create({
  //       data: {
  //         userId,
  //         totalAmount,
  //         status: 'paid',
  //       }
  //     });
  //     for (const item of orderItems) {
  //       await prisma.orderItem.create({
  //         data: {
  //           orderId: order.oid,
  //           productId: item.productId,
  //           quantity: item.quantity
  //         }
  //       });
  //       await prisma.product.update({
  //         where: { pid: item.productId },
  //         data: { stock: { decrement: item.quantity } }
  //       });
  //     }
  //     return {
  //       success: true,
  //       message: '批量下单成功',
  //       order: { oid: order.oid, totalAmount },
  //       items: orderItems
  //     };
  //   });
  // }
}
