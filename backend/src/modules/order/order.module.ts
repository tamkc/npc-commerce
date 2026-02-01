import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderLifecycleService } from './order-lifecycle.service';
import { OrderController } from './order.controller';
import { StoreOrderController } from './store-order.controller';

@Module({
  controllers: [OrderController, StoreOrderController],
  providers: [OrderService, OrderLifecycleService],
  exports: [OrderService],
})
export class OrderModule {}
