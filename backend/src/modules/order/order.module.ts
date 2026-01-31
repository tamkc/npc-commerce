import { Module } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { OrderLifecycleService } from './order-lifecycle.service.js';
import { OrderController } from './order.controller.js';
import { StoreOrderController } from './store-order.controller.js';

@Module({
  controllers: [OrderController, StoreOrderController],
  providers: [OrderService, OrderLifecycleService],
  exports: [OrderService],
})
export class OrderModule {}
