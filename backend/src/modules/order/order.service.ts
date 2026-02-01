import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrderQueryDto } from './dto/order-query.dto';
import { CreateOrderNoteDto } from './dto/create-order-note.dto';
import { OrderLifecycleService } from './order-lifecycle.service';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '../../common/dto/pagination-query.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private orderLifecycle: OrderLifecycleService,
  ) {}

  async findAll(query: OrderQueryDto): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 20,
      status,
      customerId,
      email,
      dateFrom,
      dateTo,
    } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }
    if (customerId) {
      where.customerId = customerId;
    }
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }
    if (dateFrom || dateTo) {
      where.createdAt = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.client.order.findMany({
        where,
        include: {
          items: true,
          customer: { include: { user: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.client.order.count({ where }),
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
    const order = await this.prisma.client.order.findUnique({
      where: { id },
      include: {
        items: true,
        payments: true,
        fulfillments: { include: { items: true } },
        notes: { orderBy: { createdAt: 'desc' } },
        customer: { include: { user: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByCustomer(
    customerId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where = { customerId };

    const [data, total] = await Promise.all([
      this.prisma.client.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.client.order.count({ where }),
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

  async updateStatus(id: string, status: string) {
    return this.orderLifecycle.transition(id, status);
  }

  async cancel(id: string) {
    return this.orderLifecycle.transition(id, 'CANCELLED');
  }

  async addNote(
    orderId: string,
    authorId: string | null,
    dto: CreateOrderNoteDto,
  ) {
    const order = await this.prisma.client.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.client.orderNote.create({
      data: {
        orderId,
        authorId,
        content: dto.content,
        isPrivate: dto.isPrivate ?? true,
      },
    });
  }

  async findNotes(orderId: string) {
    const order = await this.prisma.client.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.client.orderNote.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
