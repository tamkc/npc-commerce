import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController, WebhookController],
  providers: [StripeService, PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
