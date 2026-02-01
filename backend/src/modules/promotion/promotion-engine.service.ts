import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { CacheKeys, CacheTTL } from '../../common/cache/cache-keys';

@Injectable()
export class PromotionEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

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
    const cacheKey = `${CacheKeys.PROMOTIONS_ACTIVE}:auto`;
    const cached = await this.cache.get<any[]>(cacheKey);

    // If cached, filter by orderAmount client-side (the full list is small)
    if (cached) {
      return cached.filter(
        (p: any) =>
          p.minOrderAmount === null || Number(p.minOrderAmount) <= orderAmount,
      );
    }

    const now = new Date();

    const promotions = await this.prisma.client.promotion.findMany({
      where: {
        isAutomatic: true,
        isActive: true,
        deletedAt: null,
        startsAt: { lte: now },
        OR: [{ endsAt: null }, { endsAt: { gte: now } }],
      },
      include: {
        conditions: true,
      },
    });

    await this.cache.set(cacheKey, promotions, CacheTTL.PROMOTION);

    return promotions.filter(
      (p) =>
        p.minOrderAmount === null || Number(p.minOrderAmount) <= orderAmount,
    );
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
