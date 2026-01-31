import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '../../common/dto/pagination-query.dto.js';
import { CreatePromotionDto } from './dto/create-promotion.dto.js';
import { UpdatePromotionDto } from './dto/update-promotion.dto.js';

@Injectable()
export class PromotionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.client.promotion.findMany({
        skip,
        take: limit,
        include: {
          conditions: true,
          _count: {
            select: { usages: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.promotion.count(),
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
    const promotion = await this.prisma.client.promotion.findUnique({
      where: { id },
      include: {
        conditions: true,
        _count: {
          select: { usages: true },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }

    return promotion;
  }

  async findByCode(code: string) {
    const promotion = await this.prisma.client.promotion.findUnique({
      where: { code },
      include: {
        conditions: true,
        _count: {
          select: { usages: true },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundException(
        `Promotion with code "${code}" not found`,
      );
    }

    return promotion;
  }

  async create(dto: CreatePromotionDto) {
    const { conditions, ...promotionData } = dto;

    return this.prisma.client.$transaction(async (tx) => {
      const promotion = await tx.promotion.create({
        data: {
          code: promotionData.code,
          name: promotionData.name,
          description: promotionData.description,
          type: promotionData.type,
          value: promotionData.value,
          currencyCode: promotionData.currencyCode,
          usageLimit: promotionData.usageLimit,
          perCustomerLimit: promotionData.perCustomerLimit,
          minOrderAmount: promotionData.minOrderAmount,
          isAutomatic: promotionData.isAutomatic ?? false,
          isActive: promotionData.isActive ?? true,
          startsAt: new Date(promotionData.startsAt),
          endsAt: promotionData.endsAt
            ? new Date(promotionData.endsAt)
            : undefined,
        },
      });

      if (conditions && conditions.length > 0) {
        await tx.promotionCondition.createMany({
          data: conditions.map((c) => ({
            promotionId: promotion.id,
            type: c.type,
            operator: c.operator,
            value: c.value,
          })),
        });
      }

      return tx.promotion.findUnique({
        where: { id: promotion.id },
        include: {
          conditions: true,
          _count: { select: { usages: true } },
        },
      });
    });
  }

  async update(id: string, dto: UpdatePromotionDto) {
    await this.findById(id);

    const { conditions, ...promotionData } = dto;

    return this.prisma.client.$transaction(async (tx) => {
      await tx.promotion.update({
        where: { id },
        data: {
          code: promotionData.code,
          name: promotionData.name,
          description: promotionData.description,
          type: promotionData.type,
          value: promotionData.value,
          currencyCode: promotionData.currencyCode,
          usageLimit: promotionData.usageLimit,
          perCustomerLimit: promotionData.perCustomerLimit,
          minOrderAmount: promotionData.minOrderAmount,
          isAutomatic: promotionData.isAutomatic,
          isActive: promotionData.isActive,
          startsAt: promotionData.startsAt
            ? new Date(promotionData.startsAt)
            : undefined,
          endsAt: promotionData.endsAt
            ? new Date(promotionData.endsAt)
            : undefined,
        },
      });

      if (conditions !== undefined) {
        await tx.promotionCondition.deleteMany({
          where: { promotionId: id },
        });

        if (conditions.length > 0) {
          await tx.promotionCondition.createMany({
            data: conditions.map((c) => ({
              promotionId: id,
              type: c.type,
              operator: c.operator,
              value: c.value,
            })),
          });
        }
      }

      return tx.promotion.findUnique({
        where: { id },
        include: {
          conditions: true,
          _count: { select: { usages: true } },
        },
      });
    });
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.client.promotion.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async recordUsage(
    promotionId: string,
    customerId: string,
    orderId: string,
  ) {
    return this.prisma.client.$transaction(async (tx) => {
      await tx.promotionUsage.create({
        data: {
          promotionId,
          customerId,
          orderId,
        },
      });

      await tx.promotion.update({
        where: { id: promotionId },
        data: {
          usageCount: { increment: 1 },
        },
      });
    });
  }
}
