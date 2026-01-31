import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class PromotionEngineService {
  constructor(private readonly prisma: PrismaService) {}

  async validateCode(
    code: string,
    orderAmount: number,
    customerId?: string,
  ): Promise<any | null> {
    const now = new Date();

    const promotion = await this.prisma.client.promotion.findUnique({
      where: { code },
      include: {
        conditions: true,
        _count: { select: { usages: true } },
      },
    });

    if (!promotion) {
      return null;
    }

    // Check if active
    if (!promotion.isActive) {
      return null;
    }

    // Check if deleted
    if (promotion.deletedAt) {
      return null;
    }

    // Check start date
    if (promotion.startsAt && now < new Date(promotion.startsAt)) {
      return null;
    }

    // Check end date
    if (promotion.endsAt && now > new Date(promotion.endsAt)) {
      return null;
    }

    // Check usage limit
    if (
      promotion.usageLimit !== null &&
      promotion.usageCount >= promotion.usageLimit
    ) {
      return null;
    }

    // Check per-customer limit
    if (customerId && promotion.perCustomerLimit !== null) {
      const customerUsageCount = await this.prisma.client.promotionUsage.count({
        where: {
          promotionId: promotion.id,
          customerId,
        },
      });

      if (customerUsageCount >= promotion.perCustomerLimit) {
        return null;
      }
    }

    // Check min order amount
    if (
      promotion.minOrderAmount !== null &&
      orderAmount < Number(promotion.minOrderAmount)
    ) {
      return null;
    }

    return promotion;
  }

  async getAutomaticPromotions(orderAmount: number): Promise<any[]> {
    const now = new Date();

    return this.prisma.client.promotion.findMany({
      where: {
        isAutomatic: true,
        isActive: true,
        deletedAt: null,
        startsAt: { lte: now },
        OR: [{ endsAt: null }, { endsAt: { gte: now } }],
        AND: [
          {
            OR: [
              { minOrderAmount: null },
              { minOrderAmount: { lte: orderAmount } },
            ],
          },
        ],
      },
      include: {
        conditions: true,
      },
    });
  }

  calculateDiscount(
    promotion: { type: string; value: any; currencyCode?: string | null },
    subtotal: number,
  ): number {
    const value = Number(promotion.value);

    switch (promotion.type) {
      case 'PERCENTAGE':
        return (subtotal * value) / 100;

      case 'FIXED':
        return value;

      case 'FREE_SHIPPING':
        // Shipping discount is handled separately in the checkout flow
        return 0;

      case 'BUY_X_GET_Y':
        // Buy-X-Get-Y logic is handled separately based on cart items
        return 0;

      default:
        return 0;
    }
  }
}
