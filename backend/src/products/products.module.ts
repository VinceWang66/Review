import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [PrismaModule]
})
export class ProductsModule {}
