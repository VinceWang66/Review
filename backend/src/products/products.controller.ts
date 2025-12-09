import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ProductEntity } from './entities/product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtSellerGuard } from 'src/seller/jwt-seller.guard';
import { SinglePurchaseDto } from './dto/single-purchase.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtSellerGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ProductEntity })
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    return this.productsService.create(createProductDto, req.user.userId);
  }

  @Get()
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtSellerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProductEntity })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Req() req) {
    return this.productsService.update(+id, updateProductDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtSellerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProductEntity })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Patch(':id/purchase')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProductEntity })
  purchase(@Param('id') id: string, @Body() purchaseProductDto: SinglePurchaseDto, @Req() req) {
    const userId = req.user.uid;
    if (!userId) {
      console.error("无法获取用户ID，用户对象:", req.user);
      throw new UnauthorizedException('无法获取用户信息');
    }
    return this.productsService.purchase(+id, purchaseProductDto.quantity, userId);
  }

  // @Patch('purchase')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiCreatedResponse({type: Object, description:'批量下单'})
  // purchaseCart(@Body() dto: PurchaseCartDto, @Req() req) {
  //   const userId = req.user.uid;
  
  // if (!userId) {
  //   console.error('批量购买 - 无法获取用户ID，用户对象:', req.user);
  //   throw new UnauthorizedException('无法获取用户信息');
  // }
  
  // return this.productsService.purchaseCart(dto.items, userId);
  // }
}
