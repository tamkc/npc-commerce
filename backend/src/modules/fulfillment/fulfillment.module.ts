import { Module } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service.js';
import { ShippingMethodService } from './shipping-method.service.js';
import { FulfillmentController } from './fulfillment.controller.js';
import { ShippingMethodController } from './shipping-method.controller.js';

@Module({
  controllers: [FulfillmentController, ShippingMethodController],
  providers: [FulfillmentService, ShippingMethodService],
  exports: [FulfillmentService, ShippingMethodService],
})
export class FulfillmentModule {}
