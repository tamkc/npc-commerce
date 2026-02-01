import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '../../common/dto/pagination-query.dto';
import { CreatePriceListDto } from './dto/create-price-list.dto';
import { UpdatePriceListDto } from './dto/update-price-list.dto';
import { SetPriceDto } from './dto/set-price.dto';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class PricingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.client.priceList.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: { prices: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.priceList.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const priceList = await this.prisma.client.priceList.findUnique({
      where: { id },
      include: {
        prices: true,
        customerGroups: true,
      },
    });

    if (!priceList) {
      throw new NotFoundException(`Price list with ID "${id}" not found`);
    }

    return priceList;
  }

  async create(dto: CreatePriceListDto) {
    const result = await this.prisma.client.priceList.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        status: dto.status,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
    });

    await this.invalidatePriceCache();
    return result;
  }

  async update(id: string, dto: UpdatePriceListDto) {
    await this.findById(id);

    const result = await this.prisma.client.priceList.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        status: dto.status,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
    });

    await this.invalidatePriceCache();
    return result;
  }

  async remove(id: string) {
    await this.findById(id);

    const result = await this.prisma.client.priceList.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.invalidatePriceCache();
    return result;
  }

  async setPrice(dto: SetPriceDto) {
    const existing = await this.prisma.client.priceListPrice.findFirst({
      where: {
        priceListId: dto.priceListId,
        variantId: dto.variantId,
        currencyCode: dto.currencyCode,
        minQuantity: dto.minQuantity ?? 1,
      },
    });

    let result;
    if (existing) {
      result = await this.prisma.client.priceListPrice.update({
        where: { id: existing.id },
        data: { amount: dto.amount },
      });
    } else {
      result = await this.prisma.client.priceListPrice.create({
        data: {
          priceListId: dto.priceListId,
          variantId: dto.variantId,
          currencyCode: dto.currencyCode,
          amount: dto.amount,
          minQuantity: dto.minQuantity ?? 1,
        },
      });
    }

    await this.invalidatePriceCache();
    return result;
  }

  async removePrice(priceId: string) {
    const price = await this.prisma.client.priceListPrice.findUnique({
      where: { id: priceId },
    });

    if (!price) {
      throw new NotFoundException(`Price entry with ID "${priceId}" not found`);
    }

    const result = await this.prisma.client.priceListPrice.delete({
      where: { id: priceId },
    });

    await this.invalidatePriceCache();
    return result;
  }

  async linkCustomerGroup(priceListId: string, customerGroupId: string) {
    await this.findById(priceListId);

    return this.prisma.client.customerGroupPriceList.create({
      data: {
        priceListId,
        customerGroupId,
      },
    });
  }

  async unlinkCustomerGroup(priceListId: string, customerGroupId: string) {
    await this.findById(priceListId);

    return this.prisma.client.customerGroupPriceList.delete({
      where: {
        customerGroupId_priceListId: {
          customerGroupId,
          priceListId,
        },
      },
    });
  }

  private async invalidatePriceCache(): Promise<void> {
    await this.cache.delByPrefix('price:');
  }
}
