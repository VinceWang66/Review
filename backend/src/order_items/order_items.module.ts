import { Module } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { OrderItemsController } from './order_items.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  imports: [PrismaModule],
})
export class OrderItemsModule {}
