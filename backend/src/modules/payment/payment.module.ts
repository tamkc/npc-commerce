import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service.js';
import { PaymentService } from './payment.service.js';
import { PaymentController } from './payment.controller.js';
import { WebhookController } from './webhook.controller.js';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController, WebhookController],
  providers: [StripeService, PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
