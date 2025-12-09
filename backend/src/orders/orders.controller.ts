import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { OrderEntity } from './entities/order.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderOwnerGuard } from 'src/owner_guard/orderonwer_guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: OrderEntity })
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const userId = req.user.userId;
    return this.ordersService.create(createOrderDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, OrderOwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OrderEntity, isArray: true })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, OrderOwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OrderEntity, isArray: true })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OrderOwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OrderEntity })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OrderOwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OrderEntity })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
