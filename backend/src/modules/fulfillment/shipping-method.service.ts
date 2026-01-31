import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto.js';
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto.js';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '../../common/dto/pagination-query.dto.js';

@Injectable()
export class ShippingMethodService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<unknown>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [data, total] = await Promise.all([
      this.prisma.client.shippingMethod.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: { region: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.shippingMethod.count(),
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByRegion(regionId: string) {
    return this.prisma.client.shippingMethod.findMany({
      where: { regionId, isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  async findById(id: string) {
    const method = await this.prisma.client.shippingMethod.findUnique({
      where: { id },
      include: { region: true },
    });
    if (!method) throw new NotFoundException('Shipping method not found');
    return method;
  }

  create(dto: CreateShippingMethodDto) {
    return this.prisma.client.shippingMethod.create({
      data: {
        regionId: dto.regionId,
        name: dto.name,
        price: dto.price,
        minOrderAmount: dto.minOrderAmount,
        maxOrderAmount: dto.maxOrderAmount,
        isActive: dto.isActive ?? true,
        metadata: dto.metadata as any,
      },
      include: { region: true },
    });
  }

  async update(id: string, dto: UpdateShippingMethodDto) {
    await this.findById(id);
    return this.prisma.client.shippingMethod.update({
      where: { id },
      data: {
        name: dto.name,
        price: dto.price,
        minOrderAmount: dto.minOrderAmount,
        maxOrderAmount: dto.maxOrderAmount,
        isActive: dto.isActive,
        metadata: dto.metadata as any,
      },
      include: { region: true },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.client.shippingMethod.delete({ where: { id } });
  }
}
