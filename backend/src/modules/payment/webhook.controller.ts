import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator.js';
import { StripeService } from './stripe.service.js';
import { PaymentService } from './payment.service.js';

@ApiTags('Webhooks')
@Controller('webhooks/stripe')
export class WebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @ApiExcludeEndpoint()
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
  ) {
    const rawBody = (req as RawBodyRequest<Request>).rawBody;

    if (!rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    let event;
    try {
      event = this.stripeService.constructWebhookEvent(rawBody, signature);
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    await this.paymentService.handleWebhookEvent(event);

    return { received: true };
  }
}
