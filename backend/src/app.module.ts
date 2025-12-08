import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { OrderItemsModule } from './order_items/order_items.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, ProductsModule, PrismaModule, OrdersModule, CategoriesModule, OrderItemsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
