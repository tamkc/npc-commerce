import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../../database/prisma.service';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateRefundDto } from './dto/create-refund.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async createPaymentIntent(dto: CreatePaymentIntentDto) {
    const order = await this.prisma.client.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${dto.orderId} not found`);
    }

    const currency = dto.currencyCode ?? order.currencyCode ?? 'USD';
    const amount = order.total.toNumber();

    const stripeIntent = await this.stripeService.createPaymentIntent(
      amount,
      currency,
      {
        orderId: order.id,
      },
    );

    const payment = await this.prisma.client.payment.create({
      data: {
        orderId: order.id,
        provider: 'stripe',
        externalId: stripeIntent.id,
        amount: new Prisma.Decimal(amount),
        currencyCode: currency,
        status: 'PENDING',
      },
    });

    return {
      payment,
      clientSecret: stripeIntent.client_secret,
    };
  }

  async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        await this.handlePaymentSucceeded(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        await this.handlePaymentFailed(paymentIntent);
        break;
      }
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;
        await this.handlePaymentCanceled(paymentIntent);
        break;
      }
      default:
        // Unhandled event type — ignore
        break;
    }
  }

  async createRefund(dto: CreateRefundDto) {
    const payment = await this.prisma.client.payment.findUnique({
      where: { id: dto.paymentId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${dto.paymentId} not found`);
    }

    if (!payment.externalId) {
      throw new BadRequestException(
        'Payment does not have an external payment intent ID',
      );
    }

    if (payment.status !== 'CAPTURED') {
      throw new BadRequestException('Can only refund captured payments');
    }

    const stripeRefund = await this.stripeService.createRefund(
      payment.externalId,
      dto.amount,
      dto.reason,
    );

    const refund = await this.prisma.client.refund.create({
      data: {
        paymentId: payment.id,
        externalId: stripeRefund.id,
        amount: new Prisma.Decimal(dto.amount),
        reason: dto.reason,
      },
    });

    // Calculate total refunded and update order payment status
    const totalRefunded = await this.prisma.client.refund.aggregate({
      where: { paymentId: payment.id },
      _sum: { amount: true },
    });

    const refundedAmount = totalRefunded._sum.amount ?? new Prisma.Decimal(0);
    const isFullyRefunded = refundedAmount.gte(payment.amount);

    // Update the order's payment status (Order uses PaymentStatus enum with REFUNDED/PARTIALLY_REFUNDED)
    await this.prisma.client.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: isFullyRefunded ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
      },
    });

    return refund;
  }

  async findByOrder(orderId: string) {
    const order = await this.prisma.client.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.prisma.client.payment.findMany({
      where: { orderId },
      include: {
        refunds: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.client.payment.findUnique({
      where: { externalId: paymentIntent.id },
    });

    if (!payment) return;

    await this.prisma.client.payment.update({
      where: { id: payment.id },
      data: {
        status: 'CAPTURED',
        capturedAt: new Date(),
      },
    });

    await this.prisma.client.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: 'CAPTURED',
      },
    });
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.client.payment.findUnique({
      where: { externalId: paymentIntent.id },
    });

    if (!payment) return;

    await this.prisma.client.payment.update({
      where: { id: payment.id },
      data: {
        status: 'FAILED',
      },
    });
  }

  private async handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.client.payment.findUnique({
      where: { externalId: paymentIntent.id },
    });

    if (!payment) return;

    await this.prisma.client.payment.update({
      where: { id: payment.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    });
  }
}
