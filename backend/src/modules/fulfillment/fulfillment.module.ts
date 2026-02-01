import { Module } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';
import { ShippingMethodService } from './shipping-method.service';
import { FulfillmentController } from './fulfillment.controller';
import { ShippingMethodController } from './shipping-method.controller';

@Module({
  controllers: [FulfillmentController, ShippingMethodController],
  providers: [FulfillmentService, ShippingMethodService],
  exports: [FulfillmentService, ShippingMethodService],
})
export class FulfillmentModule {}
