import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { OrderItemEntity } from './entities/order_item.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OrderItemEntity, isArray: true })
  findAll() {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OrderItemEntity, isArray: true })
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(+id);
  }
}
