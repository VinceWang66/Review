import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService  } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/index-browser';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService){}

  async create(createProductDto: CreateProductDto) {
    let seller = await this.prisma.user.findUnique({
      where:{ uid : createProductDto.sellerId }
    })
    if(!seller||!seller.isseller){
      throw new ForbiddenException(`"${createProductDto.sellerId}"不是卖家`)
    }

    let category = await this.prisma.category.findUnique({
      where:{ cname:createProductDto.categoryName }
    });

    if(!category){
      //未找到对应类别直接抛出404异常
      throw new NotFoundException(`分类 "${createProductDto.categoryName}" 不存在`);
    }
    const {categoryName,price,...restData}=createProductDto;
  
    return this.prisma.product.create({
      data:{
        ...restData,
        price: new Decimal(price),
        categoryId: category.cid
      }
    });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({where: { pid: id }});
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({where: {pid: id}, data: updateProductDto});
  }

  remove(id: number) {
    return this.prisma.product.delete({where: {pid: id}});
  }
}
