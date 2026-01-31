import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateStockLocationDto } from './dto/create-stock-location.dto.js';
import { UpdateStockLocationDto } from './dto/update-stock-location.dto.js';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '../../common/dto/pagination-query.dto.js';

@Injectable()
export class StockLocationService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<unknown>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [data, total] = await Promise.all([
      this.prisma.client.stockLocation.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.stockLocation.count(),
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const loc = await this.prisma.client.stockLocation.findUnique({
      where: { id },
      include: { inventoryLevels: { include: { variant: true } } },
    });
    if (!loc) throw new NotFoundException('Stock location not found');
    return loc;
  }

  create(dto: CreateStockLocationDto) {
    return this.prisma.client.stockLocation.create({
      data: dto as Parameters<
        typeof this.prisma.client.stockLocation.create
      >[0]['data'],
    });
  }

  async update(id: string, dto: UpdateStockLocationDto) {
    await this.findById(id);
    return this.prisma.client.stockLocation.update({
      where: { id },
      data: dto as Parameters<
        typeof this.prisma.client.stockLocation.update
      >[0]['data'],
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.client.stockLocation.delete({ where: { id } });
  }
}
