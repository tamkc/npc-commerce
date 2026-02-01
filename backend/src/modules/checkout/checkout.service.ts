import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CompleteCheckoutDto } from './dto/complete-checkout.dto';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) {}

  async completeCheckout(dto: CompleteCheckoutDto) {
    const result = await this.prisma.client.$transaction(async (tx) => {
      // a) Load cart with items + variants
      const cart = await tx.cart.findUnique({
        where: { id: dto.cartId },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
        },
      });

      if (!cart) {
        throw new NotFoundException(`Cart with ID ${dto.cartId} not found`);
      }

      if (cart.completedAt) {
        throw new BadRequestException('This cart has already been checked out');
      }

      // b) Validate cart has items
      if (cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      // Must have a customer for order creation
      if (!cart.customerId) {
        throw new BadRequestException('Cart must have a customer to checkout');
      }

      // c) Calculate subtotal from cart items
      let subtotal = new Prisma.Decimal(0);
      for (const item of cart.items) {
        subtotal = subtotal.add(item.total);
      }

      // d) If cart has discountCode, validate promotion and calculate discount
      let discountTotal = new Prisma.Decimal(0);
      let promotionId: string | null = null;

      if (cart.discountCode) {
        const promotion = await tx.promotion.findFirst({
          where: {
            code: cart.discountCode,
            isActive: true,
            deletedAt: null,
            startsAt: { lte: new Date() },
            OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }],
          },
        });

        if (promotion) {
          // Check usage limit
          const withinLimit =
            promotion.usageLimit === null ||
            promotion.usageCount < promotion.usageLimit;

          if (withinLimit) {
            promotionId = promotion.id;

            if (promotion.type === 'PERCENTAGE') {
              discountTotal = subtotal.mul(promotion.value).div(100);
            } else if (promotion.type === 'FIXED') {
              discountTotal = Prisma.Decimal.min(
                new Prisma.Decimal(promotion.value),
                subtotal,
              );
            }
          }
        }
      }

      // e) Calculate tax (fixed 10% placeholder)
      const taxableAmount = subtotal.sub(discountTotal);
      const taxRate = new Prisma.Decimal('0.10');
      const taxTotal = taxableAmount.mul(taxRate);

      // f) Get shipping cost from shippingMethodId if provided
      let shippingTotal = new Prisma.Decimal(0);

      if (dto.shippingMethodId) {
        const shippingMethod = await tx.shippingMethod.findUnique({
          where: { id: dto.shippingMethodId },
        });

        if (shippingMethod) {
          shippingTotal = shippingMethod.price;
        }
      }

      // g) Calculate total
      const total = subtotal
        .sub(discountTotal)
        .add(taxTotal)
        .add(shippingTotal);

      // Resolve email
      const email = dto.email ?? cart.email;
      if (!email) {
        throw new BadRequestException('Email is required for checkout');
      }

      // Build address JSON snapshot
      const shippingAddress = {
        firstName: dto.shippingAddress.firstName,
        lastName: dto.shippingAddress.lastName,
        addressLine1: dto.shippingAddress.addressLine1,
        addressLine2: dto.shippingAddress.addressLine2 ?? null,
        city: dto.shippingAddress.city,
        state: dto.shippingAddress.state ?? null,
        postalCode: dto.shippingAddress.postalCode,
        countryCode: dto.shippingAddress.countryCode,
        phone: dto.shippingAddress.phone ?? null,
      };

      const billingAddress = dto.billingAddress
        ? {
            firstName: dto.billingAddress.firstName,
            lastName: dto.billingAddress.lastName,
            addressLine1: dto.billingAddress.addressLine1,
            addressLine2: dto.billingAddress.addressLine2 ?? null,
            city: dto.billingAddress.city,
            state: dto.billingAddress.state ?? null,
            postalCode: dto.billingAddress.postalCode,
            countryCode: dto.billingAddress.countryCode,
            phone: dto.billingAddress.phone ?? null,
          }
        : null;

      // h) Create Order (shippingAddress and billingAddress are Json fields)
      const order = await tx.order.create({
        data: {
          customerId: cart.customerId,
          email,
          currencyCode: cart.currencyCode,
          subtotal,
          taxTotal,
          shippingTotal,
          discountTotal,
          total,
          status: 'PENDING',
          paymentStatus: 'NOT_PAID',
          fulfillmentStatus: 'NOT_FULFILLED',
          shippingAddress: shippingAddress as unknown as Prisma.InputJsonValue,
          billingAddress: billingAddress as unknown as Prisma.InputJsonValue,
          regionId: cart.regionId,
          salesChannelId: cart.salesChannelId,
        },
      });

      // i) Create OrderItems from cart items
      for (const item of cart.items) {
        const variant = item.variant;
        const itemTaxAmount = item.total.mul(taxRate);

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            variantId: item.variantId,
            title: variant.product.title,
            variantTitle: variant.title,
            sku: variant.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: taxRate,
            taxAmount: itemTaxAmount,
            discountAmount: 0,
            total: item.total,
          },
        });
      }

      // j) If promotion was used, record usage
      if (promotionId) {
        await tx.promotionUsage.create({
          data: {
            promotionId,
            orderId: order.id,
            customerId: cart.customerId,
          },
        });

        await tx.promotion.update({
          where: { id: promotionId },
          data: { usageCount: { increment: 1 } },
        });
      }

      // k) Mark cart as completed
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          completedAt: new Date(),
          subtotal,
          taxTotal,
          shippingTotal,
          discountTotal,
          total,
        },
      });

      // l) Return the created order with items
      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: true,
          customer: { include: { user: true } },
        },
      });
    });

    // Emit order-completed event for background processing
    if (result) {
      await this.queueService.emitOrderCompleted(result.id);
    }

    return result;
  }
}
