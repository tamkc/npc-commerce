import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { CompleteCheckoutDto } from './dto/complete-checkout.dto.js';

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  async completeCheckout(dto: CompleteCheckoutDto) {
    return this.prisma.client.$transaction(async (tx) => {
      // a) Load cart with items + variants
      const cart = await tx.cart.findUnique({
        where: { id: dto.cartId },
        include: {
          items: {
            include: {
              variant: true,
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
            startsAt: { lte: new Date() },
            OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }],
          },
        });

        if (promotion) {
          promotionId = promotion.id;

          if (promotion.type === 'PERCENTAGE') {
            discountTotal = subtotal.mul(promotion.value).div(100);
          } else if (promotion.type === 'FIXED') {
            discountTotal = Prisma.Decimal.min(
              new Prisma.Decimal(promotion.value),
              subtotal,
            );
          }

          // Check max uses
          if (promotion.maxUses !== null) {
            const usageCount = await tx.promotionUsage.count({
              where: { promotionId: promotion.id },
            });
            if (usageCount >= promotion.maxUses) {
              discountTotal = new Prisma.Decimal(0);
              promotionId = null;
            }
          }
        }
      }

      // e) Calculate tax (fixed 10% placeholder)
      const taxableAmount = subtotal.sub(discountTotal);
      const taxTotal = taxableAmount.mul(new Prisma.Decimal('0.10'));

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

      // Resolve email: prefer dto email, then cart email
      const email = dto.email ?? cart.email;

      // Create shipping address
      const shippingAddress = await tx.address.create({
        data: {
          firstName: dto.shippingAddress.firstName,
          lastName: dto.shippingAddress.lastName,
          addressLine1: dto.shippingAddress.addressLine1,
          addressLine2: dto.shippingAddress.addressLine2,
          city: dto.shippingAddress.city,
          state: dto.shippingAddress.state,
          postalCode: dto.shippingAddress.postalCode,
          countryCode: dto.shippingAddress.countryCode,
          phone: dto.shippingAddress.phone,
        },
      });

      // Create billing address (or reuse shipping)
      let billingAddressId = shippingAddress.id;
      if (dto.billingAddress) {
        const billingAddress = await tx.address.create({
          data: {
            firstName: dto.billingAddress.firstName,
            lastName: dto.billingAddress.lastName,
            addressLine1: dto.billingAddress.addressLine1,
            addressLine2: dto.billingAddress.addressLine2,
            city: dto.billingAddress.city,
            state: dto.billingAddress.state,
            postalCode: dto.billingAddress.postalCode,
            countryCode: dto.billingAddress.countryCode,
            phone: dto.billingAddress.phone,
          },
        });
        billingAddressId = billingAddress.id;
      }

      // h) Create Order
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
          paymentStatus: 'AWAITING',
          fulfillmentStatus: 'NOT_FULFILLED',
          shippingAddressId: shippingAddress.id,
          billingAddressId,
          shippingMethodId: dto.shippingMethodId,
          regionId: cart.regionId,
          salesChannelId: cart.salesChannelId,
        },
      });

      // i) Create OrderItems from cart items
      for (const item of cart.items) {
        const variant = item.variant;
        const itemTax = item.total.mul(new Prisma.Decimal('0.10'));

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            variantId: item.variantId,
            title: variant.title,
            sku: variant.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            taxTotal: itemTax,
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
          shippingAddress: true,
          billingAddress: true,
        },
      });
    });
  }
}
