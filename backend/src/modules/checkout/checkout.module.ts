import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service.js';
import { CheckoutController } from './checkout.controller.js';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
