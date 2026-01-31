import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
    });

    this.webhookSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, string>,
  ): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata,
    });
  }

  async retrievePaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.retrieve(id);
  }

  async createRefund(
    paymentIntentId: string,
    amount: number,
    reason?: string,
  ): Promise<Stripe.Refund> {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100), // Convert to cents
      reason: reason as Stripe.RefundCreateParams.Reason,
    });
  }

  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret,
    );
  }
}
