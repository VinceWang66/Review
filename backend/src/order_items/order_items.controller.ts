import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { OrderItemEntity } from './entities/order_item.entity';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get()
  @ApiOkResponse({ type: OrderItemEntity, isArray: true })
  findAll() {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: OrderItemEntity, isArray: true })
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(+id);
  }
}
