import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({ 
        data: createCategoryDto 
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('分类名称已存在');
      }
      throw error;
    }
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      select: {
        cid: true,
        cname: true,
        // 获取商品数量
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    // 转换格式
    return categories.map(category => ({
      cid: category.cid,
      cname: category.cname,
      productCount: category._count.products,
    }));
  }

  // 获取单个分类，包含商品数量
  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { cid: id },
      select: {
        cid: true,
        cname: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`分类 #${id} 不存在`);
    }

    return {
      id: category.cid,
      cid: category.cid,
      cname: category.cname,
      productCount: category._count.products,
    };
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { cid: id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    // 1. 先检查分类是否存在
    const category = await this.prisma.category.findUnique({
      where: { cid: id },
    });
    if (!category) {
      throw new NotFoundException(`分类 #${id} 不存在`);
    }
    // 2. 检查是否有关联产品
    const relatedProducts = await this.prisma.product.count({
      where: { categoryId: id },
    });
  
    if (relatedProducts > 0) {
      throw new BadRequestException(
        `无法删除分类 "${category.cname}"，还有 ${relatedProducts} 个产品关联到此分类。`,
      );
    }
    // 3. 安全删除
    return this.prisma.category.delete({
      where: { cid: id },
    });
  }
}
