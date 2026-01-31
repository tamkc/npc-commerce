import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateInventoryLevelDto } from './dto/create-inventory-level.dto.js';
import { UpdateInventoryLevelDto } from './dto/update-inventory-level.dto.js';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '../../common/dto/pagination-query.dto.js';
import { CacheService } from '../../common/cache/cache.service.js';
import { CacheKeys, CacheTTL } from '../../common/cache/cache-keys.js';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<unknown>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [data, total] = await Promise.all([
      this.prisma.client.inventoryLevel.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: { variant: true, stockLocation: true },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.client.inventoryLevel.count(),
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByVariant(variantId: string) {
    const cacheKey = `${CacheKeys.INVENTORY_LEVEL}:${variantId}`;
    const cached = await this.cache.get<any[]>(cacheKey);
    if (cached) return cached;

    const levels = await this.prisma.client.inventoryLevel.findMany({
      where: { variantId },
      include: { stockLocation: true },
    });

    await this.cache.set(cacheKey, levels, CacheTTL.INVENTORY);
    return levels;
  }

  async findByLocation(stockLocationId: string) {
    return this.prisma.client.inventoryLevel.findMany({
      where: { stockLocationId },
      include: { variant: true },
    });
  }

  async findById(id: string) {
    const level = await this.prisma.client.inventoryLevel.findUnique({
      where: { id },
      include: { variant: true, stockLocation: true },
    });
    if (!level) throw new NotFoundException('Inventory level not found');
    return level;
  }

  create(dto: CreateInventoryLevelDto) {
    return this.prisma.client.inventoryLevel.create({
      data: {
        variantId: dto.variantId,
        stockLocationId: dto.stockLocationId,
        onHand: dto.onHand,
        available: dto.onHand,
        lowStockThreshold: dto.lowStockThreshold,
      },
      include: { variant: true, stockLocation: true },
    });
  }

  async update(id: string, dto: UpdateInventoryLevelDto) {
    const existing = await this.findById(id);
    const newOnHand = dto.onHand;
    const diff = newOnHand - existing.onHand;
    const result = await this.prisma.client.inventoryLevel.update({
      where: { id },
      data: {
        onHand: newOnHand,
        available: { increment: diff },
        lowStockThreshold: dto.lowStockThreshold,
      },
      include: { variant: true, stockLocation: true },
    });

    await this.cache.del(`${CacheKeys.INVENTORY_LEVEL}:${existing.variantId}`);
    return result;
  }

  async remove(id: string) {
    const existing = await this.findById(id);
    const result = await this.prisma.client.inventoryLevel.delete({ where: { id } });
    await this.cache.del(`${CacheKeys.INVENTORY_LEVEL}:${existing.variantId}`);
    return result;
  }

  async getLowStock() {
    return this.prisma.client.inventoryLevel.findMany({
      where: {
        lowStockThreshold: { not: null },
      },
      include: { variant: true, stockLocation: true },
    });
  }
}
