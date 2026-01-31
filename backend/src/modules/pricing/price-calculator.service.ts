import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CacheService } from '../../common/cache/cache.service.js';
import { CacheKeys, CacheTTL } from '../../common/cache/cache-keys.js';

export interface CalculatedPrice {
  amount: number;
  source: string;
}

@Injectable()
export class PriceCalculatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async calculatePrice(
    variantId: string,
    quantity: number,
    currencyCode: string,
    customerGroupId?: string,
  ): Promise<CalculatedPrice> {
    const cacheKey = `${CacheKeys.PRICE_CALCULATION}:${variantId}:${quantity}:${currencyCode}:${customerGroupId ?? 'none'}`;
    const cached = await this.cache.get<CalculatedPrice>(cacheKey);
    if (cached) return cached;
    // Step a) Get variant base price
    const variant = await this.prisma.client.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(
        `Product variant with ID "${variantId}" not found`,
      );
    }

    // Use variant base price as the starting point
    let bestAmount: number | null = Number(variant.price);
    let bestSource = 'base';

    const now = new Date();

    // Step b) Find applicable price lists (ACTIVE, within date range, matching currency)
    const priceListWhereConditions: any[] = [
      {
        status: 'ACTIVE',
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [
          {
            OR: [{ endsAt: null }, { endsAt: { gte: now } }],
          },
        ],
        deletedAt: null,
        prices: {
          some: {
            variantId,
            currencyCode,
            minQuantity: { lte: quantity },
          },
        },
      },
    ];

    // Step c) If customerGroupId provided, also check customer-group-linked price lists
    if (customerGroupId) {
      priceListWhereConditions.push({
        status: 'ACTIVE',
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [
          {
            OR: [{ endsAt: null }, { endsAt: { gte: now } }],
          },
        ],
        deletedAt: null,
        customerGroups: {
          some: { customerGroupId },
        },
        prices: {
          some: {
            variantId,
            currencyCode,
            minQuantity: { lte: quantity },
          },
        },
      });
    }

    const applicablePriceLists = await this.prisma.client.priceList.findMany({
      where: {
        OR: priceListWhereConditions,
      },
      include: {
        prices: {
          where: {
            variantId,
            currencyCode,
            minQuantity: { lte: quantity },
          },
        },
      },
    });

    // Step d) Among matching prices where minQuantity <= quantity, pick the lowest amount
    for (const priceList of applicablePriceLists) {
      for (const price of priceList.prices) {
        const priceAmount = Number(price.amount);
        if (bestAmount === null || priceAmount < bestAmount) {
          bestAmount = priceAmount;
          bestSource = `price_list:${priceList.name}`;
        }
      }
    }

    // Step e) Return lowest price with source label
    if (bestAmount === null) {
      throw new NotFoundException(
        `No price found for variant "${variantId}" in currency "${currencyCode}"`,
      );
    }

    const result = {
      amount: bestAmount,
      source: bestSource,
    };

    await this.cache.set(cacheKey, result, CacheTTL.PRICE);
    return result;
  }
}
